
import { handleActions } from 'redux-actions';

const initialState = {
  error: false,
  noOfErrors: 0,
  name: 'My node',
  bestBlock: 'loading...',
  hashrate: 'loading...',
  peers: 0,
  version: '-',
};

export default handleActions({
  error (state, action) {
    return {
      ...state,
      disconnected: (action.payload.message === 'Invalid JSON RPC response: ""'),
      noOfErrors: state.noOfErrors + 1
    };
  },

  'update blockNumber' (state, action) {
    return {
      ...resetError(state),
      bestBlock: `${action.payload}`
    };
  },

  'update hashrate' (state, action) {
    return {
      ...resetError(state),
      hashrate: `${action.payload}`
    };
  },

  'update peerCount' (state, action) {
    return {
      ...state,
      peers: action.payload
    };
  },

  'update version' (state, action) {
    return {
      ...resetError(state),
      version: action.payload
    };
  }

}, initialState);

function resetError (state) {
  return {
    ...state,
    disconnected: false,
    noOfErrors: 0
  };
}
