
import { handleActions } from 'redux-actions';

const initialState = {
  path: ''
};

export default handleActions({

  'update parityPath' (state, action) {
    return {
      ...state,
      path: action.payload
    };
  }

}, initialState);
