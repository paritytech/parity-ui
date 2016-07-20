import { handleActions } from 'redux-actions';

const initialState = [];

export default handleActions({

  'update dapps' (state, action) {
    return action.payload;
  }

}, initialState);
