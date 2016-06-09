/* global chrome */

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
    this.sendMsg('personal_confirmTransaction', [ id, {}, password ]);
    return next(action);
  }

  onReject = (store, next, action) => {
    const id = action.payload;
    this.sendMsg('personal_rejectTransaction', [ id ]);
    return next(action);
  }

  sendMsg (method, params) {
    const type = 'ws';
    chrome.runtime.sendMessage({ type, method, params }, res => {
      log('[APP] cb ', method,  res);
    });
  }

}
