#!/usr/bin/env node

'use strict';

const fs = require('fs');
const nl = /\n+/;
const BOOLEAN_RESPONSE = '`Boolean` - whether the call was successful';

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
  method.outputFormatter = getOutputFormatters()[name] || null;
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
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_flush',
      desc: '?',
      params: [],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_newFilterEx',
      desc: '?',
      params: [''],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_getFilterChangesEx',
      desc: '?',
      params: [''],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_getFilterLogsEx',
      desc: '?',
      params: [''],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_getLogsEx',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_register',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_unregister',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_fetchQueuedTransactions',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_signTransaction',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_inspectTransaction',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'eth_notePassword',
      desc: '?',
      params: ['?'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'personal_newAccount',
      desc: 'Creates new account',
      params: ['`DATA` - Password'],
      returns: BOOLEAN_RESPONSE
    },
    {
      name: 'personal_unlockAccount',
      desc: '?',
      params: ['?', '?', '?'],
      returns: BOOLEAN_RESPONSE
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
      returns: BOOLEAN_RESPONSE
    }, {
      name: 'ethcore_setMinGasPrice',
      desc: 'Changes minimal gas price for transaction to be accepted to the queue.',
      params: ['`QUANTITY` - Minimal gas price'],
      returns: BOOLEAN_RESPONSE
    }, {
      name: 'ethcore_gasFloorTarget',
      desc: 'Returns current target for gas floor',
      params: [],
      returns: '`QUANTITY` - Gas Floor Target'
    }, {
      name: 'ethcore_setGasFloorTarget',
      desc: 'Changes current gas floor target.',
      params: ['`QUANTITY` - Gas Floor Target'],
      returns: BOOLEAN_RESPONSE
    }, {
      name: 'ethcore_setAuthor',
      desc: 'Changes author (coinbase) for mined blocks.',
      params: ['`DATA`, 20 Bytes - Address'],
      returns: BOOLEAN_RESPONSE
    }, {
      name: 'ethcore_setTransactionsLimit',
      desc: 'Changes limit for transactions in queue.',
      params: ['`QUANTITY` - New Limit'],
      returns: BOOLEAN_RESPONSE
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
    }, {
      name: 'ethcore_nodeName',
      desc: 'Returns node name (identity)',
      params: [],
      returns: '`DATA` - Node name'
    }, {
      name: 'trace_filter',
      desc: 'Returns traces matching given filter',
      params: ['`OBJECT` - The filter object'],
      returns: '`ARRAY` - Traces matching given filter'
    }, {
      name: 'trace_get',
      desc: 'Returns trace at given position.',
      params: [
        '`HASH` - Transaction hash',
        '`INTEGER` - Trace position witing transaction'
      ],
      returns: '`Object` - Trace'
    }, {
      name: 'trace_transaction',
      desc: 'Returns all traces of given transaction',
      params: ['`HASH` - Transaction hash'],
      returns: '`ARRAY` - Traces of given transaction'
    }, {
      name: 'trace_block',
      desc: 'Returns traces created at given block',
      params: ['`BLOCKNUMBER` - Integer block number, or "latest" for the last mined block or "pending", "earliest" for not yet mined transactions'],
      returns: '`ARRAY` - Block traces'
    }
  ];
}

function getOutputFormatters () {
  return {
    'ethcore_minGasPrice': 'outputBigNumberFormatter',
    'ethcore_extraData': null,
    'ethcore_gasFloorTarget': 'outputBigNumberFormatter',
    'ethcore_transactionsLimit': 'outputBigNumberFormatter',
    'eth_getBalance': 'outputBigNumberFormatter',
    'eth_getTransactionCount': 'utils.toDecimal',
    'eth_getTransactionByHash': 'outputTransactionFormatter',
    'eth_getTransactionReceipt': 'outputTransactionReceiptFormatter',
    'eth_estimateGas': 'utils.toDecimal',
    'eth_syncing': 'outputSyncingFormatter',
    'net_peerCount': 'utils.toDecimal'
  };
}

function getInputFormatters () {
  return {
    'ethcore_setExtraData': [
      'utils.toHex'
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
