import { handleActions } from 'redux-actions';
import { isChrome } from '../utils/extension';

const initialState = {
  isChrome: isChrome(),
  isLoading: true,
  version: ''
};

export default handleActions({

  'update extensionVersion' (state, action) {
    return {
      ...state,
      version: action.payload || '',
      isLoading: false
    };
  }

}, initialState);
