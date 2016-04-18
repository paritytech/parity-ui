
import {handleActions} from 'redux-actions';
import rpcMetods from '../data/rpc.json';

const initialState = {
  prevCalls: [],
  selectedMethod: rpcMetods.methods[0]
};

export const actionHandlers = {

  'add rpcResponse' (state, action) {
    return {
      ...state,
      prevCalls: [action.payload].concat(state.prevCalls)
    };
  },

  'sync rpcStateFromLocalStorage' (state, action) {
    return {
      ...state,
      prevCalls: action.payload.prevCalls,
      selectedMethod: action.payload.selectedMethod
    };
  },

  'select rpcMethod' (state, action) {
    return {
      ...state,
      selectedMethod: action.payload
    };
  }

};

export default handleActions(actionHandlers, initialState);
