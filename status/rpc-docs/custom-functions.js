#!/usr/bin/env node
'use strict';

const BOOLEAN_RESPONSE = '`Boolean` - whether the call was successful';

module.exports = [
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
    name: 'personal_signAndSendTransaction',
    desc: 'Sends and signs a transaction given account passphrase. Does not require the account to be unlocked nor unlocks the account for future transactions. ',
    params: [
      {
        'description': '`Object` - The transaction object',
        'details': {
          'from': '`DATA`, 20 Bytes - The address the transaction is send from.',
          'to': '`DATA`, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.',
          'gas': '`QUANTITY`  - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.',
          'gasPrice': '`QUANTITY`  - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas',
          'value': '`QUANTITY`  - (optional) Integer of the value send with this transaction',
          'data': '`DATA`  - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see [Ethereum Contract ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI)',
          'nonce': '`QUANTITY`  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.'
        }
      },
      '`PASS`, Passphrase to unlock `from` account.'
    ],
    returns: '`DATA`, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.'
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
