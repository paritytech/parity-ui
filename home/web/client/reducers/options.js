import { handleActions } from 'redux-actions';

const initialState = {
  allAccounts: false
};

export default handleActions({

  // TODO [adgo] - might not be needed
  'update optionsAllAcounts' (state, action) {
    return {
      allAccounts: action.payload
    };
  }

}, initialState);
