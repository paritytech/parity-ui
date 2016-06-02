
import { handleActions } from 'redux-actions';

const initialState = [];

export default handleActions({

  'update transactions' (state, action) {
    return action.payload;
  }

}, initialState);
