
import {removeToast} from '../actions/toastr';

export default class ToastrMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'add toast') {
        return next(action);
      }

      if (typeof action.payload === 'string') {
        action.payload = {
          message: action.payload
        };
      }

      action.payload.toastNo = store.getState().toastr.toastNo;

      setTimeout(() => store.dispatch(removeToast(action.payload.toastNo)), 4000);
      next(action);
    };
  }
}
