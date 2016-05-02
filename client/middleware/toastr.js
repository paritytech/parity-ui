
import {removeToast} from '../actions/toastr';

export default class ToastrMiddleware {

  constructor (time = 4000) {
    this._time = time;
  }

  toMiddleware () {
    return store => next => action => {
      let delegate;
      switch (action.type) {
        case 'add toast': delegate = ::this.onAddToast; break;
        case 'add errorToast': delegate = ::this.onAddErrorToast; break;
        case 'add successToast': delegate = ::this.onAddSuccessToast; break;
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

  onAddToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.payload.toastNo = store.getState().toastr.toastNo;
    setTimeout(() => store.dispatch(removeToast(action.payload.toastNo)), this._time);
    next(action);
  }

  onAddErrorToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.payload.type = 'error';
    action.type = 'add toast';
    this.onAddToast(store, next, action);
  }

  onAddSuccessToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.payload.type = 'success';
    action.type = 'add toast';
    this.onAddToast(store, next, action);
  }

  // allow shorthand by passing just string to "add toast" action
  ensureObject (any) {
    if (typeof any === 'string') {
      any = {
        message: any
      };
    }

    return any;
  }
}
