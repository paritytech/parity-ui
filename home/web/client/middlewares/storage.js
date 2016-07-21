import { isEqual } from 'lodash';
import { updateAccountsNames } from '../actions/rpc';
import { updateIsfirstRun } from '../actions/firstRun';
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
        next(action);
        this.onUpdateAccountsNames(action.payload);
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
    this.handleFirstRun(store);
    this.storage.onAccountsNames(names => {
      this.syncAccountsNames(store, names);
    });
  }

  onUpdateAccountsNames (names) {
    this.storage.setAccountsNames(names);
  }

  onUpdateAccounts (store) {
    this.storage.getAccountsNames(names => {
      this.syncAccountsNames(store, names);
    });
  }

  syncAccountsNames (store, accountsNames) {
    const { rpc } = store.getState();
    if (isEqual(rpc.accountsNames, accountsNames)) {
      return;
    }

    store.dispatch(
      updateAccountsNames(
        this.fixAccountNames(accountsNames, rpc.accounts)
      )
    );
  }

  handleFirstRun (store) {
    this.storage.getNotFirstRun(notFirstRun => {
      store.dispatch(updateIsfirstRun(!notFirstRun));
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
