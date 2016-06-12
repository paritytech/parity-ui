
import { handleActions } from 'redux-actions';

const initialState = {
  isLoading: true
};

export default handleActions({

  'update isLoading' (state, action) {
    return {
      isLoading: action.payload
    };
  }

}, initialState);
