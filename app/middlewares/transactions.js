/* global chrome */
import { addFinishedTransaction } from '../actions/transactions';

export default class TransactionsMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'confirm transaction': delegate = this.onConfirm; break;
        case 'reject transaction': delegate = this.onReject; break;
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

  onConfirm = (store, next, action) => {
    const { id, password, fee } = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.sendMsg('personal_confirmTransaction', [ id, {}, password ], res => {
      // todo [adgo] - detect errors better
      if (typeof res === 'string') {
        transaction.hash = res;
        store.dispatch(addFinishedTransaction(transaction));
      }
    });
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.sendMsg('personal_rejectTransaction', [ id ], res => {
      if (res === true) {
        store.dispatch(addFinishedTransaction(transaction));
      }
    });
    return next(action);
  }

  sendMsg (method, params, cb) {
    const type = 'ws';
    chrome.runtime.sendMessage({ type, method, params }, cb);
  }

  getTransaction (store, id) {
    return store.getState().transactions.pending.find(pt => pt.id === id);
  }

}
