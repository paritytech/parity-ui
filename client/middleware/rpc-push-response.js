
import {unshiftToLocalStorage} from '../actions/localstorage';

export default class RPCPushResponseMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'unshift RPCResponse') {
        return next(action);
      }

      const payload = { key: 'rpcPrevCalls', value: action.payload };
      const newAction = unshiftToLocalStorage(payload);
      store.dispatch(newAction);
      next(action);
    };
  }
}
