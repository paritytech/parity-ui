#!/usr/bin/env node

'use strict';

const fs = require('fs');
const nl = /\n+/;

const val = fs.readFileSync(`${__dirname}/docs.md`, 'utf8');
const funcs = val.split(/\s#### /)
  // Skip first element (intro docs)
  .slice(1)
  // Extract data
  .map(parseSingleMethod)
  // Add our custom functions
  .concat(customFunctions())
  // Add formatters
  .map(addFormatters);

console.log(funcs);
fs.writeFileSync(`${__dirname}/../client/data/rpc.json`, JSON.stringify({
  methods: funcs
}, null, 2), 'utf8');

function addFormatters (method) {
  const name = method.name;
  method.inputFormatters = getInputFormatters()[name] || [];
  method.outputFormatters = getOutputFormatters()[name] || null;
  return method;
}

function parseSingleMethod (data) {
  const parts = data.split('##### ');
  let name = parts[0].split(nl)[0];
  let desc = nonEmpty(parts[0].split(nl).slice(1)).join('\n');
  let params = extractParams(nonEmpty(parts[1].split(nl).slice(1)));
  let returns = nonEmpty(parts[2].split(nl).slice(1))[0];

  return {
    name, desc, params, returns
  };
}

function extractParams (params) {
  if (params[0] === 'none') {
    return [];
  }

  return params.filter(line => {
    return line.match(/[0-9]+\. /);
  }).map(line => {
    return line.replace(/^[0-9]+\. /, '');
  });
}

function nonEmpty (a) {
  return a.filter(x => x);
}

function customFunctions () {
  return [
    {
      name: 'eth_pendingTransactions',
      desc: '?',
      params: [],
      returns: false
    },
    {
      name: 'eth_flush',
      desc: '?',
      params: [],
      returns: false
    },
    {
      name: 'eth_newFilterEx',
      desc: '?',
      params: [''],
      returns: false
    },
    {
      name: 'eth_getFilterChangesEx',
      desc: '?',
      params: [''],
      returns: false
    },
    {
      name: 'eth_getFilterLogsEx',
      desc: '?',
      params: [''],
      returns: false
    },
    {
      name: 'eth_getLogsEx',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_register',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_unregister',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_fetchQueuedTransactions',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_signTransaction',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_inspectTransaction',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'eth_notePassword',
      desc: '?',
      params: ['?'],
      returns: false
    },
    {
      name: 'personal_newAccount',
      desc: 'Creates new account',
      params: ['`DATA` - Password'],
      returns: false
    },
    {
      name: 'personal_unlockAccount',
      desc: '?',
      params: ['?', '?', '?'],
      returns: false
    },
    {
      name: 'ethcore_minGasPrice',
      desc: 'Returns currently set minimal gas price',
      params: [],
      returns: '`QUANTITY` - Minimal Gas Price'
    }, {
      name: 'ethcore_extraData',
      desc: 'Returns currently set extra data',
      params: [],
      returns: '`DATA` - Extra data'
    }, {
      name: 'ethcore_setExtraData',
      desc: 'Changes extra data for newly mined blocks',
      params: ['`DATA`- Extra Data'],
      returns: false
    }, {
      name: 'ethcore_setMinGasPrice',
      desc: 'Changes minimal gas price for transaction to be accepted to the queue.',
      params: ['`QUANTITY` - Minimal gas price'],
      returns: false
    }, {
      name: 'ethcore_gasFloorTarget',
      desc: 'Returns current target for gas floor',
      params: [],
      returns: ['`QUANTITY` - Gas Floor Target']
    }, {
      name: 'ethcore_setGasFloorTarget',
      desc: 'Changes current gas floor target.',
      params: ['`QUANTITY` - Gas Floor Target'],
      returns: false
    }, {
      name: 'ethcore_setAuthor',
      desc: 'Changes author (coinbase) for mined blocks.',
      params: ['`DATA`, 20 Bytes - Address'],
      returns: false
    }, {
      name: 'ethcore_setTransactionsLimit',
      desc: 'Changes limit for transactions in queue.',
      params: ['`QUANTITY` - New Limit'],
      returns: false
    }, {
      name: 'ethcore_transactionsLimit',
      desc: 'Changes limit for transactions in queue.',
      params: [],
      returns: '`QUANTITY` - Current max number of transactions in queue.'
    }, {
      name: 'ethcore_netChain',
      desc: 'Returns the name of the connected chain.',
      params: [],
      returns: '`DATA` - chain name'
    }, {
      name: 'ethcore_netMaxPeers',
      desc: 'Returns maximal number of peers.',
      params: [],
      returns: '`QUANTITY` - Maximal number of peers'
    }, {
      name: 'ethcore_netPort',
      desc: 'Returns network port the node is listening on.',
      params: [],
      returns: '`QUANTITY` - Port Number'
    }, {
      name: 'ethcore_rpcSettings',
      desc: 'Returns basic settings of rpc (enabled, port, interface).',
      params: [],
      returns: '`OBJECT` - JSON object containing rpc settings'
    }
  ];
}

function getOutputFormatters () {
  return {
    'ethcore_minGasPrice': 'toBigNumber',
    'ethcore_extraData': 'decodeExtraData',
    'ethcore_gasFloorTarget': 'toBigNumber',
    'ethcore_transactionsLimit': 'toBigNumber',
    'eth_getBalance': 'toBigNumber',
    'eth_getTransactionCount': 'utils.toDecimal',
    'eth_getTransactionByHash': 'outputTransactionFormatter',
    'eth_getTransactionReceipt': 'outputTransactionReceiptFormatter',
    'eth_estimateGas': 'utils.toDecimal',
    'net_peerCount': 'utils.toDecimal'
  };
}

function getInputFormatters () {
  return {
    'ethcore_setExtraData': [
      'encodeExtraData'
    ],
    'ethcore_setMinGasPrice': [
      'utils.toHex'
    ],
    'ethcore_setGasFloorTarget': [
      'utils.toHex'
    ],
    'ethcore_setAuthor': [
      'inputAddressFormatter'
    ],
    'ethcore_setTransactionsLimit': [
      'utils.toHex'
    ],
    'eth_getBalance': [
      'inputAddressFormatter',
      'inputDefaultBlockNumberFormatter'
    ],
    'eth_getStorageAt': [
      null,
      'utils.toHex',
      'inputDefaultBlockNumberFormatter'
    ],
    'eth_getTransactionCount': [
      null,
      'inputDefaultBlockNumberFormatter'
    ],
    'eth_getCode': [
      'inputAddressFormatter',
      'inputDefaultBlockNumberFormatter'
    ],
    'eth_sendTransaction': [
      'inputTransactionFormatter'
    ],
    'eth_call': [
      'inputCallFormatter',
      'inputDefaultBlockNumberFormatter'
    ],
    'eth_sign': [
      'inputAddressFormatter',
      null
    ],
    'eth_sendRawTransaction': [
      null
    ],
    'eth_estimateGas': [
      'inputCallFormatter'
    ],
    'personal_newAccount': [
      null
    ],
    'personal_unlockAccount': [
      null,
      null,
      null
    ],
    'shh_post': [
      'inputPostFormatter'
    ]
  };
}
