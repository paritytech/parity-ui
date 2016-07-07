export default class LocalstorageMiddleware {

  constructor (tokenSetter) {
    this.setToken = tokenSetter;
  }

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'update token': delegate = ::this.onUpdateToken; break;
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

  onUpdateToken (store, next, action) {
    this.setToken(action.payload);
    next(action);
  }

}
