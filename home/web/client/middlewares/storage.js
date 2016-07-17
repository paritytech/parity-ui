import { isEqual } from 'lodash';
import { updateAccountsNames } from '../actions/rpc';
import Storage from '../components/Storage';

export default class StorageMiddleware {

  constructor () {
    this.storage = Storage.crossOrigin();
  }

  toMiddleware () {
    return store => next => action => {

      if (action.type === 'init app') {
        this.onInitApp(store);
        next(action);
        return;
      }

      if (action.type === 'update accountsNames') {
        this.onUpdateAccountsNames(action.payload);
        next(action);
        return;
      }

      if (action.type === 'update accounts') {
        this.onUpdateAccounts(store);
        next(action);
        return;
      }

      next(action);
    };
  }

  onInitApp (store) {
    this.handleFirstRun();
    this.syncAccountsNames(store);
  }

  onUpdateAccountsNames (names) {
    this.storage.setAccountsNames(names);
  }

  onUpdateAccounts (store) {
    this.syncAccountsNames(store);
  }

  syncAccountsNames (store) {
    const { rpc } = store.getState();
    this.storage.getAccountsNames(accountsNames => {
      if (isEqual(rpc.accountsNames, accountsNames)) {
        return;
      }
      store.dispatch(
        updateAccountsNames(
          this.fixAccountNames(accountsNames, rpc.accounts)
        )
      );
    });
  }

  handleFirstRun () {
    this.storage.getNotFirstRun(notFirstRun => {
      if (notFirstRun) {
        return;
      }
      this.storage.saveNotFirstRun();
    });
  }

  fixAccountNames (names, accounts) {
    const copy = Object.assign({}, names);
    return accounts.reduce((memo, acc, idx) => {
      memo[acc] = names[acc] || `Account ${idx + 1}`;
      return memo;
    }, copy);
  }

}
