
import {handleActions} from 'redux-actions';
import localStore from 'store';

const initialState = {
  prevCalls: localStore.get('rpcPrevCalls') || [],
  selectedMethod: localStore.get('rpcPrevCalls')[0] || {}
};

export const actionHandlers = {

  'unshift RPCResponse' (state, action) {
    return {
      ...state,
      prevCalls: [action.payload].concat(state.prevCalls)
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
