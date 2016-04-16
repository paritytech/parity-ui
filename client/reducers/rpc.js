
import {handleActions} from 'redux-actions';
import localStore from 'store';

const initialState = {
  prevCalls: localStore.get('rpcPrevCalls') || []
};

export const actionHandlers = {

  'unshift RPCResponse' (state, action) {
    return {
      ...state,
      prevCalls: [action.payload].concat(state.prevCalls)
    };
  }

};

export default handleActions(actionHandlers, initialState);
