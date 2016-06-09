
import { handleActions } from 'redux-actions';

const initialState = {
	pending: [],
	finished: []
}

export default handleActions({

  'update pendingTransactions' (state, action) {
    return {
    	...state,
    	pending: action.payload
    };
  },

  'add finishedTransactions' (state, action) {
  	log('[APP] add finishedTransactions ', state, action);
    return {
    	...state,
    	finished: [action.payload].concat(state.finished)
    };
  }

}, initialState);
