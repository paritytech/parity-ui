
import { handleActions } from 'redux-actions';

const initialState = {
  chain: 'loading...',
  networkPort: 0,
  maxPeers: 0,
  rpcEnabled: false,
  rpcInterface: '-',
  rpcPort: 0
};

export default handleActions({
  'update netChain' (state, action) {
    return {
      ...state,
      chain: action.payload
    };
  },

  'update netPort' (state, action) {
    return {
      ...state,
      networkPort: action.payload
    };
  },

  'update netMaxPeers' (state, action) {
    return {
      ...state,
      maxPeers: action.payload
    };
  },

  'update rpcSettings' (state, action) {
    const rpc = action.payload;

    return {
      ...state,
      rpcEnabled: rpc.enabled,
      rpcInterface: rpc.interface,
      rpcPort: rpc.port
    };
  }
}, initialState);
