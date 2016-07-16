// todo [adgo] - better name

import { handleActions } from 'redux-actions';

const initialState = {
  isReady: false,
  errorCount: 0,
  isDisconnected: false,
  signerPort: 0, // assimilate signer disabled
  unsignedTransactionsCount: 0,
  peers: 0,
  activeAccount: '',
  accounts: [],
  accountsNames: {},
  isSyncing: false,
  latestBlock: 1234,
  startingBlock: 1234,
  highestBlock: 1234,
  network: 'homestead',
  createdAccount: '',
  createdAccountError: ''
};

export default handleActions({

  'error rpc' (state, action) {
    return {
      ...state,
      isDisconnected: (action.payload.message === 'Invalid JSON RPC response: ""'),
      errorCount: state.errorCount + 1
    };
  },

  'update unsignedTransactionsCount' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      unsignedTransactionsCount: action.payload
    };
  },

  'update syncing' (state, action) {
    const syncing = action.payload;
    if (!syncing) {
      return {
        ...state,
        ...onRpcSuccess(),
        isSyncing: false
      };
    }
    return {
      ...state,
      ...onRpcSuccess(),
      isSyncing: true,
      startingBlock: parseInt(syncing.startingBlock, 10),
      highestBlock: parseInt(syncing.highestBlock, 10)
    };
  },

  'update network' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      network: networkName(action.payload)
    };
  },

  'update peers' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      peers: action.payload
    };
  },

  'update activeAccount' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      activeAccount: action.payload
    };
  },

  'update accounts' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      accounts: action.payload
    };
  },

  'update accountsNames' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      accountsNames: action.payload
    };
  },

  'update latestBlock' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      latestBlock: parseInt(action.payload, 10)
    };
  },

  'update createdAccount' (state, action) {
    return {
      ...state,
      ...onRpcSuccess(),
      createdAccountError: '',
      createdAccount: action.payload
    };
  },

  'reset createAccount' (state, action) {
    return {
      ...state,
      createdAccountError: '',
      createdAccount: ''
    };
  },

  'error createdAccount' (state, action) {
    return {
      ...state,
      createdAccountError: action.payload
    };
  }

}, initialState);

function onRpcSuccess () {
  return {
    isReady: true,
    isDisconnected: false,
    errorCount: 0
  };
}

function networkName (netId) {
  const networks = {
    0x0: 'olympic',
    0x1: 'homestead',
    0x2: 'morden'
  };
  return networks[netId] || 'unknown';
}
