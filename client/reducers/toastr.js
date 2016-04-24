
import { handleActions } from 'redux-actions';

const initialState = {
  toasts: []
};

export default handleActions({

  'add toast' (state, action) {
    return {
      ...state,
      toasts: [action.payload].concat(state.toasts)
    };
  }

}, initialState);
