export default class LocalstorageMiddleware {

  constructor (tokenSetter) {
    this.setToken = tokenSetter;
  }

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
    this.setToken(action.payload);
    next(action);
  }

}
