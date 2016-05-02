
export function filterErrors (xs) {
  return xs.filter(isError);
}

export function hasErrors (xs) {
  if (!xs) {
    return;
  }
  return !!xs.find(isError);
}

export function isError (x) {
  return Object.prototype.toString.call(x) === '[object Error]';
}
