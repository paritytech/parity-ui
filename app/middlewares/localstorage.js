export default class LocalstorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'submit token': delegate = ::this.onSubmitToken; break;
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

  onSubmitToken (store, next, action) {
    chrome.storage.local.set({ sysuiToken: JSON.stringify(action.payload) });
  }

}
