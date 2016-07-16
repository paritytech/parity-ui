import { handleActions } from 'redux-actions';

const initialState = {
  open: false,
  from: '',
  to: '',
  value: '',
  data: '',
  error: ''
};

export default handleActions({

  'update pendingTransaction' (state, action) {
    return {
      state: action.payload
    };
  },

  'reset pendingTransaction' (state, action) {
    return {
      state: initialState
    };
  }



}, initialState);
