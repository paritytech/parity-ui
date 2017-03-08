import { handleActions } from 'redux-actions';

const initialState = {
  isReady: false
};

export default handleActions({

  'update isFirstRun' (state, action) {
    return {
      isReady: true,
      isFirstRun: action.payload
    };
  }

}, initialState);
