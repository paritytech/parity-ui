#!/usr/bin/env node
'use strict';

module.exports = addFormatters;

function addFormatters (method) {
  const name = method.name;
  method.inputFormatters = getInputFormatters()[name] || [];
  method.outputFormatter = getOutputFormatters()[name] || null;
  return method;
}

function getOutputFormatters () {
  return {
    'ethcore_minGasPrice': 'outputBigNumberFormatter',
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
