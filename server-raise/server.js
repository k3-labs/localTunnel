import { config } from 'dotenv';
config();
import log from 'book';
import Koa from 'koa';
import cors from '@koa/cors';
import tldjs from 'tldjs';
import Debug from 'debug';
import http from 'http';
import { hri } from 'human-readable-ids';
import Router from 'koa-router';
import { AbiCoder, Contract, JsonRpcProvider, keccak256 } from 'ethers';

import attestationCenterAbi from './abi/attestation-center.abi.js';
import oblsAbi from './abi/obls.abi.js';
import { hashToPoint, init, parseG1, parseG2, operatorLocalTunnelDomain, verifyRaw } from "./mcl/mcl.js";


import ClientManager from './lib/ClientManager.js';

const debug = Debug('localtunnel:server');

export default function(opt) {
    opt = opt || {};

    const validHosts = (opt.domain) ? [opt.domain] : undefined;
    const myTldjs = tldjs.fromUserSettings({ validHosts });
    const landingPage = opt.landing || 'https://localtunnel.github.io/www/';

    const attestationCenterContract = new Contract(
        process.env.ATTESTATION_CONTRACT_ADDRESS,
        attestationCenterAbi,
        new JsonRpcProvider(process.env.RPC_URL)
    );

    const oblsContract = new Contract(
        process.env.OBLS_CONTRACT_ADDRESS,
        oblsAbi,
        new JsonRpcProvider(process.env.RPC_URL)
    )

    const verificationMessage = process.env.SIGNATURE_MESSAGE;

    const verificationMessageHash = keccak256(
        AbiCoder.defaultAbiCoder().encode(["string"], [verificationMessage]),
      );

    function GetClientIdFromHostname(hostname) {
        return myTldjs.getSubdomain(hostname);
    }

    init();

    const manager = new ClientManager(opt);

    const schema = opt.secure ? 'https' : 'http';

    const app = new Koa();
    const router = new Router();

    // Apply CORS middleware globally
    app.use(cors({
        origin: '*'
    }));

    router.get('/api/status', async (ctx, next) => {
        const stats = manager.stats;
        ctx.body = {
            tunnels: stats.tunnels,
            mem: process.memoryUsage(),
        };
    });

    router.get('/api/tunnels/:id/status', async (ctx, next) => {
        const clientId = ctx.params.id;
        const client = manager.getClient(clientId);
        if (!client) {
            ctx.throw(404);
            return;
        }

        const stats = client.stats();
        ctx.body = {
            connected_sockets: stats.connectedSockets,
            remote_ip: stats.remoteIp
        };
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    // root endpoint
    // app.use(async (ctx, next) => {
    //     const path = ctx.request.path;

    //     // skip anything not on the root path
    //     if (path !== '/') {
    //         await next();
    //         return;
    //     }

    //     const isNewClientRequest = ctx.query['new'] !== undefined;
    //     if (isNewClientRequest) {
    //         const reqId = hri.random();
    //         debug('making new client with id %s', reqId);
    //         const info = await manager.newClient(reqId);

    //         const url = schema + '://' + info.id + '.' + ctx.request.host;
    //         info.url = url;
    //         ctx.body = info;
    //         return;
    //     }

    //     // no new client request, send to landing page
    //     ctx.redirect(landingPage);
    // });

    // anything after the / path is a request for a specific client name
    // This is a backwards compat feature
    app.use(async (ctx, next) => {
        const parts = ctx.request.path.split('/');

        // any request with several layers of paths is not allowed
        // rejects /foo/bar
        // allow /foo
        if (parts.length !== 2) {
            await next();
            return;
        }

        const data = parts[1];
        try {
            const {signedLocaltunnelMessage, operatorAddress} = JSON.parse(decodeURIComponent(data));

            if (!signedLocaltunnelMessage || !operatorAddress) {
                sendErrorResponse(ctx);
                return;
            }
            const operatorIndex = await attestationCenterContract.operatorsIdsByAddress(operatorAddress);

            const operatorBlsPubKey = await oblsContract.getOperatorBLSPubKey(operatorIndex);

            const blsPubKeyG2 = parseG2(operatorBlsPubKey);
            const messagePoint = hashToPoint(verificationMessageHash, operatorLocalTunnelDomain());
            const isVerified = verifyRaw(parseG1(signedLocaltunnelMessage), blsPubKeyG2, messagePoint);

            if (!isVerified) {
                sendErrorResponse(ctx);
                return;
            }
        } catch(e) {
            sendErrorResponse(ctx);
            return;
        }

        // limit requested hostnames to 63 characters
        // if (! /^(?:[a-z0-9][a-z0-9\-]{4,63}[a-z0-9]|[a-z0-9]{4,63})$/.test(reqId)) {
        //     const msg = 'Invalid subdomain. Subdomains must be lowercase and between 4 and 63 alphanumeric characters.';
        //     ctx.status = 403;
        //     ctx.body = {
        //         message: msg,
        //     };
        //     return;
        // }

        const reqId = hri.random();
        debug('making new client with id %s', reqId);
        const info = await manager.newClient(reqId);

        const url = schema + '://' + info.id + '.' + ctx.request.host;
        info.url = url;
        ctx.body = info;
        return;
    });

    const server = http.createServer();

    const appCallback = app.callback();

    server.on('request', (req, res) => {
        // without a hostname, we won't know who the request is for
        const hostname = req.headers.host;
        if (!hostname) {
            res.statusCode = 400;
            res.end('Host header is required');
            return;
        }

        const clientId = GetClientIdFromHostname(hostname);
        if (!clientId) {
            appCallback(req, res);
            return;
        }

        const client = manager.getClient(clientId);
        if (!client) {
            res.statusCode = 404;
            res.end('404');
            return;
        }

        client.handleRequest(req, res);
    });

    server.on('upgrade', (req, socket, head) => {
        const hostname = req.headers.host;
        if (!hostname) {
            socket.destroy();
            return;
        }

        const clientId = GetClientIdFromHostname(hostname);
        if (!clientId) {
            socket.destroy();
            return;
        }

        const client = manager.getClient(clientId);
        if (!client) {
            socket.destroy();
            return;
        }

        client.handleUpgrade(req, socket);
    });

    return server;
};

function sendErrorResponse(ctx) {
    const msg = 'Could not verify K3 Registration Message';
    ctx.status = 201;
    ctx.body = {
        message: msg,
    };
}