
import { addErrorToast } from '../actions/toastr';

export function hasErrors (xs) {
  if (!xs) {
    return;
  }
  return !!xs.find(isError);
}

export function isError (x) {
  return Object.prototype.toString.call(x) === '[object Error]';
}

export function toastError (obj, dispatch) {
  dispatch(addErrorToast(obj.toString()));
}

export function toastErrors (xs, dispatch) {
  xs.filter(isError)
     .map(obj => toastError(obj, dispatch));
}
