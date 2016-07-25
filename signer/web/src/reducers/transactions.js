
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

  'start confirmTransaction' (state, action) {
    return {
      ...state,
      pending: setIsSending(state.pending, action.payload.id, true)
    };
  },

  'success confirmTransaction' (state, action) {
    const { id, txHash } = action.payload;
    const confirmed = Object.assign(
      state.pending.find(p => p.id === id),
      { txHash, status: 'confirmed' }
    );

    return {
      ...state,
      pending: removeWithId(state.pending, id),
      finished: [confirmed].concat(state.finished)
    };
  },

  'error confirmTransaction' (state, action) {
    return {
      ...state,
      pending: setIsSending(state.pending, action.payload.id, false)
    };
  },

  'start rejectTransaction' (state, action) {
    return {
      ...state,
      pending: setIsSending(state.pending, action.payload.id, true)
    };
  },

  'success rejectTransaction' (state, action) {
    const { id } = action.payload;
    const rejected = Object.assign(
      state.pending.find(p => p.id === id),
      { status: 'rejected' }
    );
    return {
      ...state,
      pending: removeWithId(state.pending, id),
      finished: [rejected].concat(state.finished)
    };
  },

  'error rejectTransaction' (state, action) {
    return {
      ...state,
      pending: setIsSending(state.pending, action.payload.id, false)
    };
  }

}, initialState);

function removeWithId (pending, id) {
  return pending.filter(tx => tx.id !== id).slice();
}

function setIsSending (pending, id, isSending) {
  return pending.map(p => {
    if (p.id === id) {
      p.isSending = isSending;
    }
    return p;
  }).slice();
}
