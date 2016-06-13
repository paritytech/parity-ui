import { hashHistory } from 'react-router';

export default class AppMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'update isLoading': delegate = ::this.onUpdateIsLoading; break;
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

  onUpdateIsLoading (store, next, action) {
    const redirectTo = action.payload ? '/loading' : '/';
    hashHistory.push(redirectTo);
    next(action);
  }

}
