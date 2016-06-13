
import { handleActions } from 'redux-actions';

const initialState = {
  isConnected: false,
  port: process.env.WS_PORT || 8180,
  token: ''
};

export default handleActions({

  'update isConnected' (state, action) {
    return {
      ...state,
      isConnected: action.payload
    };
  },

  'update token' (state, action) {
    return {
      ...state,
      token: action.payload
    };
  },

  'update port' (state, action) {
    return {
      ...state,
      port: action.payload
    };
  }

}, initialState);
