
import { handleActions } from 'redux-actions';

const initialState = {
  isLoading: true,
  isWsConnected: false,
  isParityRunning: false
};

export default handleActions({

  'update appState' (state, action) {
    const { isLoading, isWsConnected, isParityRunning } = action.payload;
    return {
      isLoading, isWsConnected, isParityRunning
    };
  }

}, initialState);
