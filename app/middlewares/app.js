import { hashHistory } from 'react-router';

export default class AppMiddleware {

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'update appState': delegate = ::this.onUpdateAppState; break;
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

  onUpdateAppState (store, next, action) {
    // call next first to update state
    next(action);
    // then redirect wit updated state, so routes->requireAuth would behave as expected
    const { isLoading, isParityRunning } = action.payload;
    if (!isParityRunning) {
      hashHistory.push('/parityNotRunning');
    } else if (isLoading) {
      hashHistory.push('/loading');
    } else {
      hashHistory.push('/');
    }
  }

}
