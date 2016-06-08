import isEqual from 'lodash.isequal';
import { updateTransactions } from '../actions/transactions';
import { updateIsAuthorized, updateIsConnected } from '../actions/ws';

export default class LocalstorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'init app': delegate = this.onInitApp; break;
        case 'submit token': delegate = this.onSubmitToken; break;
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
    const { dispatch } = store;
    const transactions = store.getState().transactions;
    this.initTransactions(dispatch, transactions);
    this.subscribeToTransactions(dispatch);
    this.initIsConnected(dispatch);
    this.subscribeToIsConnected(dispatch);
    return next(action);
  }

  onSubmitToken (store, next, action) {
    chrome.storage.local.set({ sysuiToken: JSON.stringify(action.payload) });
  }

  initIsConnected (dispatch) {
    chrome.storage.local.get('isConnected', obj => {
      const isConnected = JSON.parse(obj.isConnected);
      dispatch(updateIsConnected(isConnected));
    });
  }

  subscribeToIsConnected (dispatch) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && 'isConnected' in changes) {
        log('[APP] LS middleware: isConnected changed!');
        const isConnected = JSON.parse(changes.isConnected.newValue);
        dispatch(updateIsConnected(isConnected));
      }
    });
  }

  // ws.js will update transactions from parity client to localstorage
  // this updates the transactions from localstorage to redux on init
  initTransactions (dispatch, stateStoredTransactions) {
    chrome.storage.local.get('transactions', obj => {
      const transactions = JSON.parse(obj.transactions);
      if (isEqual(stateStoredTransactions, transactions)) {
        return;
      }

      dispatch(updateTransactions(transactions));
    });
  }

  // ws.js will update transactions from parity client to localstorage
  // this listenes to incoming transaction and syncs the changes with redux
  subscribeToTransactions (dispatch) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && 'transactions' in changes) {
        log('[APP] LS middleware: transactions changed!');
        const transactions = JSON.parse(changes.transactions.newValue);
        dispatch(updateTransactions(transactions));
      }
    });
  }

}
