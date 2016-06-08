
import { handleActions } from 'redux-actions';

const initialState = {
  isConnected: false,
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
  }

}, initialState);
