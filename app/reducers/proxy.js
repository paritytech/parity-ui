import { handleActions } from 'redux-actions';

const initialState = 'http://localhost:8080/proxy/proxy.pac';

export default handleActions({

  'update proxy' (state, action) {
    return action.payload;
  }

}, initialState);
