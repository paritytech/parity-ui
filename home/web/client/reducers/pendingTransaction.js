import { handleActions } from 'redux-actions';

const initialState = {
  isSending: false,
  open: false,
  error: '',
  transaction: {},
  callback: null
};

export default handleActions({

  'update pendingTransaction' (state, action) {
    const { transaction, callback } = action.payload;
    return {
      ...state,
      open: true,
      error: '',
      transaction,
      callback
    };
  },

  'start signTransaction' (state, action) {
    return {
      ...state,
      isSending: true,
      error: ''
    };
  },

  'success signTransaction' (state, action) {
    return initialState;
  },

  'error signTransaction' (state, action) {
    return {
      ...state,
      isSending: false,
      error: action.payload
    };
  },

  'reject transaction' (state, action) {
    return initialState;
  }

}, initialState);
