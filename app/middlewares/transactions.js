import { addFinishedTransaction, errorTransaction } from '../actions/transactions';

import WsBase from '../utils/wsBase';

export default class TransactionsMiddleware {

  constructor (wsPath) {
    const ws = new WsBase(wsPath);
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
    const { id, password } = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.ws.send('personal_confirmTransaction', [ id, {}, password ], res => {
      console.log('[APP] confirm transaction cb ', res);

      // transaction confirmation failed
      if (res === false) {
        const errMsg = `Failed to confirm transaction: ${id}, make sure the password is correct`;
        store.dispatch(errorTransaction(errMsg));
        return next(action);
      }

      // todo [adgo] - detect errors better
      if (typeof res === 'string') {
        transaction.txHash = res;
        store.dispatch(addFinishedTransaction(transaction));
      }
    });
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.ws.send('personal_rejectTransaction', [ id ], res => {
      console.log('[APP] reject transaction cb ', res);
      if (res === true) {
        store.dispatch(addFinishedTransaction(transaction));
      }
    });
    return next(action);
  }

  onUpdateToken = (store, next, action) => {
    const token = action.payload;
    this.ws.init(token);
    next(action);
  }

  getTransaction (store, id) {
    return store.getState().transactions.pending.find(pt => pt.id === id);
  }

}
