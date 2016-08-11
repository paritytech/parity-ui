
import { handleActions } from 'redux-actions';

const initialState = {
  token: ''
};

export default handleActions({

  'update token' (state, action) {
    return {
      ...state,
      token: action.payload
    };
  },

}, initialState);
