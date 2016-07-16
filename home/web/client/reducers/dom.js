import { handleActions } from 'redux-actions';

const initialState = {
  isReady: false
};

export default handleActions({

  'update isDomReady' (state, action) {
    return {
      isReady: action.payload
    };
  }

}, initialState);
