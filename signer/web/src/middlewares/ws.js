import logger from '../utils/logger';
import * as actions from '../actions/transactions';

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
        case 'start confirmTransaction': delegate = this.onConfirmStart; break;
        case 'start rejectTransaction': delegate = this.onRejectStart; break;
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

  onConfirmStart = (store, next, action) => {
    next(action);
    const { id, password } = action.payload;
    this.send('personal_confirmTransaction', [ id, {}, password ], (err, txHash) => {
      logger.log('[WS MIDDLEWARE] confirm transaction cb:', err, txHash);
      if (err) {
        store.dispatch(actions.errorConfirmTransaction({ id, err: err.message }));
        return;
      }

      store.dispatch(actions.successConfirmTransaction({ id, txHash }));
      return;
    });
  }

  onRejectStart = (store, next, action) => {
    next(action);
    const id = action.payload;
    this.send('personal_rejectTransaction', [ id ], (err, res) => {
      logger.log('[WS MIDDLEWARE] reject transaction cb:', err, res);
      if (err) {
        store.dispatch(actions.errorRejectTransaction({ id, err: err.message }));
        return;
      }
      store.dispatch(actions.successRejectTransaction({ id }));
    });
  }

  send (method, params, callback) {
    const payload = {
      jsonrpc: '2.0',
      method, params
    };
    this.ws.send(payload, callback);
  }

}
