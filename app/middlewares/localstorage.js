import isEqual from 'lodash.isequal';
import { updatePendingTransactions } from '../actions/transactions';
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
    this.initPendingTransactions(dispatch, transactions);
    this.subscribeToPendingTransactions(dispatch);
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

  // ws.js will update pendingTransactions from parity client to localstorage
  // this updates the transactions from localstorage to redux on init
  initPendingTransactions (dispatch, stateStoredTransactions) {
    chrome.storage.local.get('pendingTransactions', obj => {
      const pendingTransactions = JSON.parse(obj.pendingTransactions);
      dispatch(updatePendingTransactions(pendingTransactions));
    });
  }

  // ws.js will update pendingTransactions from parity client to localstorage
  // this listenes to incoming transaction and syncs the changes with redux
  subscribeToPendingTransactions (dispatch) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && 'pendingTransactions' in changes) {
        log('[APP] LS middleware: pendingTransactions changed!');
        const pendingTransactions = JSON.parse(changes.pendingTransactions.newValue);
        dispatch(updatePendingTransactions(pendingTransactions));
      }
    });
  }

}
