import logger from '../utils/logger';
import { addRejectedTransaction, addConfirmedTransaction, addErrorTransaction, errorTransaction } from '../actions/transactions';

import WsBase from '../utils/wsBase';

export default class TransactionsMiddleware {

  constructor (initToken, wsPath) {
    const ws = new WsBase(wsPath);
    ws.init(initToken);
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
      logger.log('confirm transaction cb ', res);

      // wrong password
      if (res === false) {
        const errMsg = 'Failed to confirm transaction. make sure the password is correct';
        store.dispatch(errorTransaction(errMsg));
        return next(action);
      }

      // transaction confirmation failed (probably not enough funds)
      // todo [adgo] - replace with better errors msgs once parity returns them
      if (res === undefined) {
        transaction.status = 'rejected';
        transaction.error = true;
        transaction.msg = 'Sender account has insufficient funds to complete transcation';
        store.dispatch(addErrorTransaction(transaction));
        return next(action);
      }

      // todo [adgo] - detect errors better
      if (typeof res === 'string') {
        transaction.status = 'confirmed';
        transaction.txHash = res;
        transaction.msg = 'Confirmed';
        store.dispatch(addConfirmedTransaction(transaction));
      }
    });
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.ws.send('personal_rejectTransaction', [ id ], res => {
      logger.log('reject transaction cb ', res);
      if (res === true) {
        transaction.status = 'rejected';
        transaction.msg = 'Rejected';
        store.dispatch(addRejectedTransaction(transaction));
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
