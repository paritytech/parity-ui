import isEqual from 'lodash.isequal';
import { updateTransactions } from '../actions/transactions';

export default class LocalstorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'init app': delegate = this.onInitApp; break;
        default:
          next(action);
          return;
      }

      if (!delegate) {
        return;
      }

      delegate(store, next, action);
    };
  }

  onInitApp = (store, next, action) => {
    this.initLocalStorageTransactions(store.dispatch, store.getState().transactions);
    this.subscribeToLocalStorageTransactions(store.dispatch);
    return next(action);
  }

  // ws.js will update transactions from parity client to localstorage
  // this updates the transactions from localstorage to redux on init
  initLocalStorageTransactions (dispatch, stateStoredTransactions) {
    chrome.storage.local.get('transactions', (obj) => {
      const transactions = JSON.parse(obj.transactions);
      if (isEqual(stateStoredTransactions, transactions)) {
        return;
      }

      dispatch(updateTransactions(transactions));
    });
  }

  // ws.js will update transactions from parity client to localstorage
  // this listenes to incoming transaction and syncs the changes with redux
  subscribeToLocalStorageTransactions (dispatch) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && 'transactions' in changes) {
        const { transactions } = changes;
        log('LS: transactions changed!');
        log('new value: ', transactions.newValue);
        log('old value: ', transactions.oldValue);
        dispatch(updateTransactions(transactions.newValue));
      }
    });
  }

}
