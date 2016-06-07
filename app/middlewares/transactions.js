const WS_URL = 'ws://localhost:8180';

export default class TransactionsMiddleware {

  constructor () {
    this.ws = new WebSocket(WS_URL);
  }

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
    const { id, password, gasPrice } = action.payload;
    this.ws.send('personal_confirmTransaction', [ id, {}, password ]);
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    this.ws.send('personal_rejectTransaction', [ id ] );
    return next(action);
  }

}
