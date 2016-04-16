
import {handleActions} from 'redux-actions';

const initialState = {
  lastResponse: 'No request has been made (yet!)'
};

export const actionHandlers = {

  'update RPCResponse' (state, action) {
    console.warn('action', action);
    return {
      ...state,
      lastResponse: action.payload
    };
  }
};

export default handleActions(actionHandlers, initialState);
