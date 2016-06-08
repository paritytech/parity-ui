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

    // this.ws.send('personal_confirmTransaction', [ id, {}, password ], res => {
    //   log('[WS] transction middleware confirm', res);
    // });
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    // this.ws.send('personal_rejectTransaction', [ id ], res => {
    //   log('[WS] transction middleware reject', res);
    // });
    return next(action);
  }

}
