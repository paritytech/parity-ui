
import { handleActions } from 'redux-actions';

const initialState = {
  pending: [],
  finished: []
};

export default handleActions({

  'update pendingTransactions' (state, action) {
    return {
      ...state,
      pending: action.payload
    };
  },

  'add finishedTransactions' (state, action) {
    const pending = state.pending.filter(tx => tx.id !== action.payload.id);

    return {
      ...state,
      pending,
      finished: [action.payload].concat(state.finished)
    };
  }

}, initialState);
