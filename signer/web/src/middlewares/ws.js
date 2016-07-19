import logger from '../utils/logger';
import { addRejectedTransaction, addConfirmedTransaction, addErrorTransaction, errorTransaction } from '../actions/transactions';

export default class LocalstorageMiddleware {

  constructor (ws, setToken) {
    this.setToken = setToken;
    this.ws = ws;
  }

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'update token': delegate = this.onUpdateToken; break;
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

  onUpdateToken = (store, next, action) => {
    this.setToken(action.payload);
    next(action);
  }

  onConfirm = (store, next, action) => {
    const { id, password } = action.payload;
    const transaction = this.getTransaction(store, id); // needed for uccessful cb
    this.send('personal_confirmTransaction', [ id, {}, password ], res => {
      logger.log('confirm transaction cb ', res);

      // wrong password
      if (res === false) {
        const errMsg = 'Failed to confirm transaction. Make sure the password is correct';
        store.dispatch(errorTransaction(errMsg));
        return next(action);
      }

      // transaction confirmation failed (probably not enough funds)
      // todo [adgo] - replace with better errors msgs once parity returns them
      if (res === undefined) {
        transaction.status = 'rejected';
        transaction.error = true;
        transaction.msg = 'Not enough funds.';
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
    this.send('personal_rejectTransaction', [ id ], res => {
      logger.log('reject transaction cb ', res);
      if (res === true) {
        transaction.status = 'rejected';
        transaction.msg = 'Rejected';
        store.dispatch(addRejectedTransaction(transaction));
      }
    });
    return next(action);
  }

  getTransaction (store, id) {
    return store.getState().transactions.pending.find(pt => pt.id === id);
  }

  send (method, params, callback) {
    const payload = {
      jsonrpc: '2.0',
      method, params
    };
    this.ws.send(payload, callback);
  }

}
