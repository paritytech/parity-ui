
import { addErrorToast } from '../actions/toastr';

// param: xs => [{}]
export function hasErrors (xs) {
  if (!xs) {
    return;
  }

  return !!xs.find(isError);
}

export function isError (obj) {
  return Object.prototype.toString.call(obj) === '[object Error]';
}

// param: xs => [{}]
export function toastErrors (xs, dispatch) {
  xs.filter(isError)
     .map(obj => addErrorToast(obj.toString()))
     .map(dispatch);
}

export function toastError (obj, dispatch) {
  dispatch(addErrorToast(obj.toString()));
}
