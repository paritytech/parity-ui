
import { handleActions } from 'redux-actions';

const initialState = {
  path: process.env.WS_PATH || '127.0.0.1:8180',
  token: ''
};

export default handleActions({

  'update token' (state, action) {
    return {
      ...state,
      token: action.payload
    };
  },

  'update wsPath' (state, action) {
    return {
      ...state,
      path: action.payload
    };
  }

}, initialState);
