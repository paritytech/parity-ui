
import { isArray, clone } from 'lodash';
import { isError } from '../util/error';

export default class ToastrMiddleware {

  constructor (time = 4000) {
    this._time = time;
    this._toastActions = this.getToastActions();
    this._errorToastActions = this.getErrorToastActions();
    this._successToastActions = this.getSuccessToastActions();
  }

  toMiddleware () {
    return store => next => action => {
      let delegate;
      let {type} = action;
      if (this._toastActions.indexOf(type) > -1) {
        delegate = ::this.onAddToast;
      } else if (this._errorToastActions.indexOf(type) > -1) {
        delegate = ::this.onAddErrorToast;
      } else if (this._successToastActions.indexOf(type) > -1) {
        delegate = ::this.onAddSuccessToast;
      } else {
        return next(action);
      }

      delegate(store, next, { payload: this.formatClone(action.payload) });
    };
  }

  onAddToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.type = 'add toast';
    action.payload.message = this.ensureFormat(action.payload.message);
    action.payload.toastNo = store.getState().toastr.toastNo;

    setTimeout(() => this.removeToast(next, action.payload.toastNo), this._time);
    next(action);
  }

  onAddErrorToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.payload.type = 'error';
    this.onAddToast(store, next, action);
  }

  onAddSuccessToast (store, next, action) {
    action.payload = this.ensureObject(action.payload);
    action.payload.type = 'success';
    this.onAddToast(store, next, action);
  }

  removeToast (next, toastNo) {
    next({ type: 'remove toast', payload: toastNo });
  }

  ensureObject (any) {
    if (any && any.message) {
      return any;
    }

    return {
      message: any
    };
  }

  getToastActions () {
    return ['copy toClipboard'];
  }

  getErrorToastActions () {
    return ['error rpc'];
  }

  getSuccessToastActions () {
    return [];
  }

  ensureFormat (message) {
    if (isArray(message)) {
      return message.join('\n');
    }

    return message;
  }

  // make sure to not modify original payload if it's mutable
  formatClone (payload) {
    if (typeof payload !== 'object') {
      return payload;
    }

    if (isArray(payload)) {
      return clone(payload);
    }

    // error objects can't b cloned, so just return the message prop
    if (isError(payload)) {
      return payload.message;
    }

    return clone(payload);
  }

}
