import logger from 'dapps-react-components/src/util/logger';
import { updateActiveAccount, errorCreatedAccount, updateCreatedAccount } from '../actions/rpc';

export default class RpcMiddleware {

  constructor (web3) {
    this.web3 = web3;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'update accounts') {
        this.onUpdateAccounts(store, action.payload);
        next(action);
        return;
      }

      if (action.type === 'create account') {
        this.onCreateAccount(store, action.payload);
        next(action);
        return;
      }

      next(action);
    }
  }

  // if there are no accounts, set first account as active
  // this logic will be replaced by a dedicated identity
  // management mechanism in the future
  onUpdateAccounts (store, nextAccounts) {
    const { accounts } = store.getState().rpc;
    if (!nextAccounts.length || accounts.length) {
      return;
    }
    store.dispatch(updateActiveAccount(nextAccounts[0]));
  }

  onCreateAccount (store, password) {
    this.web3.personal.newAccount(password, (err, address) => {
      if (err) {
        store.dispatch(errorCreateAccount('error creating account ' + err.message));
        return;
      }
      store.dispatch(updateCreatedAccount(address));
    });
  }

}
