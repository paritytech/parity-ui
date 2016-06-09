/* global chrome */
import { addFinishedTransaction } from '../actions/transactions';

import WsBase from '../utils/wsBase';

const ws = new WsBase();

export default class TransactionsMiddleware {

  constructor () {
    this.ws = ws;
  }

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'confirm transaction': delegate = this.onConfirm; break;
        case 'reject transaction': delegate = this.onReject; break;
        case 'update token': delegate = this.onUpdateToken; break;
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
    this.ws.send('personal_confirmTransaction', [ id, {}, password ], res => {
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
    this.ws.send('personal_rejectTransaction', [ id ], res => {
      if (res === true) {
        store.dispatch(addFinishedTransaction(transaction));
      }
    });
    return next(action);
  }

  onUpdateToken = (store, next, action) => {
    const token = action.payload;
    this.ws.setToken(token);
    this.ws.init(token);
  }

  getTransaction (store, id) {
    return store.getState().transactions.pending.find(pt => pt.id === id);
  }

}
