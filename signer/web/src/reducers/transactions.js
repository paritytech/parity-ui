
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
    const pending = state.pending.map(p => {
      if (p.id === action.payload.id) {
        p.isSending = true;
      }
      return p;
    });
    return {
      ...state,
      pending
    };
  },

  'success confirmTransaction' (state, action) {
    const { id, txHash } = action.payload;
    const confirmed = Object.assign({},
      state.pending.find(p => p.id === id),
      { txHash }, { status: 'confirmed' }
    );
    return {
      ...state,
      pending: state.pending.filter(tx => tx.id !== action.payload.id),
      finished: [confirmed].concat(state.finished)
    };
  },

  'error confirmTransaction' (state, action) {
    const pending = state.pending.map(p => {
      if (p.id === action.payload.id) {
        p.isSending = false;
      }
      return p;
    });
    return {
      ...state,
      pending
    };
  },

  'start rejectTransaction' (state, action) {
    const pending = state.pending.map(p => {
      if (p.id === action.payload.id) {
        p.isSending = true;
      }
      return p;
    });
    return {
      ...state,
      pending
    };
  },

  'success rejectTransaction' (state, action) {
    const { id } = action.payload;
    const rejected = Object.assign({},
      state.pending.find(p => p.id === id), { status: 'rejected' }
    );
    return {
      ...state,
      pending: state.pending.filter(tx => tx.id !== id),
      finished: [rejected].concat(state.finished)
    };
  },

  'error rejectTransaction' (state, action) {
    const pending = state.pending.map(p => {
      if (p.id === action.payload.id) {
        p.isSending = false;
      }
      return p;
    });
    return {
      ...state,
      pending
    };
  }

}, initialState);
