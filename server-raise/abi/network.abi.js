export default [
    {
      "inputs": [
        { "internalType": "address", "name": "target", "type": "address" }
      ],
      "name": "AddressEmptyCode",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "account", "type": "address" }
      ],
      "name": "AddressInsufficientBalance",
      "type": "error"
    },
    { "inputs": [], "name": "FailedInnerCall", "type": "error" },
    { "inputs": [], "name": "InvalidInitialization", "type": "error" },
    {
      "inputs": [
        { "internalType": "address", "name": "operator", "type": "address" }
      ],
      "name": "InvalidSignature",
      "type": "error"
    },
    { "inputs": [], "name": "NotInitializing", "type": "error" },
    {
      "inputs": [
        { "internalType": "address", "name": "token", "type": "address" }
      ],
      "name": "SafeERC20FailedOperation",
      "type": "error"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "message", "type": "string" }
      ],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "OperatorDeactivated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[4]",
          "name": "blsKey",
          "type": "uint256[4]"
        }
      ],
      "name": "OperatorRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rate",
          "type": "uint256"
        }
      ],
      "name": "SetSlashingRate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "SetToken",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_amount", "type": "uint256" },
        { "internalType": "uint256", "name": "_expiry", "type": "uint256" },
        { "internalType": "bytes", "name": "_signature", "type": "bytes" }
      ],
      "name": "depositIntoStrategy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "depositRewardsWithApprove",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_operator", "type": "address" }
      ],
      "name": "freezeOperator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_networkOwner", "type": "address" },
        {
          "internalType": "address",
          "name": "_networkManager",
          "type": "address"
        },
        { "internalType": "address", "name": "_token", "type": "address" },
        {
          "internalType": "address",
          "name": "_networksRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_messageHandler",
          "type": "address"
        },
        { "internalType": "address", "name": "_vault", "type": "address" }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "messageHandler",
      "outputs": [
        {
          "internalType": "contract IMessageHandler",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "networkManager",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "networkOwner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numOfOperators",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "operatorsIndexs",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint32", "name": "_serveUntilBlock", "type": "uint32" }
      ],
      "name": "recordFirstStakeUpdate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256[4]", "name": "_blsKey", "type": "uint256[4]" }
      ],
      "name": "registerAsOperator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IMessageHandler",
          "name": "_messageHandler",
          "type": "address"
        }
      ],
      "name": "setMessageHandler",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract INetworksRegistry",
          "name": "_networksRegistry",
          "type": "address"
        }
      ],
      "name": "setNetworksRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_slashingRate", "type": "uint256" }
      ],
      "name": "setSlashingRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "contract IERC20", "name": "_token", "type": "address" }
      ],
      "name": "setToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "slashingRate",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_operator", "type": "address" },
        {
          "internalType": "uint256",
          "name": "_lastPayedTask",
          "type": "uint256"
        },
        { "internalType": "uint256", "name": "_feeToClaim", "type": "uint256" }
      ],
      "name": "withdrawRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "to", "type": "address" }],
      "name": "withdrawSlashedStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  