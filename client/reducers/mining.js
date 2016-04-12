
import { handleActions } from 'redux-actions';

const initialState = {
  author: 'loading...',
  extraData: 'loading...',
  minGasPrice: 'loading...',
  gasFloorTarget: 'loading...'
};

export const actionHandlers = {

  'update address' (state, action) {
    return {
      ...state,
      author: `${action.payload}`
    };
  },

  'update gasPrice' (state, action) {
    return {
      ...state,
      minGasPrice: `${action.payload}`
    };
  },

  'update gasFloorTarget' (state, action) {
    return {
      ...state,
      gasFloorTarget: `${action.payload}`
    };
  },

  'update extraData' (state, action) {
    return {
      ...state,
      extraData: `${action.payload}`
    };
  }

};

export default handleActions(actionHandlers, initialState);
