
import { handleActions } from 'redux-actions';

const initialState = {
  isLoading: true,
  isParityRunning: false
};

export default handleActions({

  'update appState' (state, action) {
    return {
      isLoading: action.payload.isLoading,
      isParityRunning: action.payload.isParityRunning
    };
  }

}, initialState);
