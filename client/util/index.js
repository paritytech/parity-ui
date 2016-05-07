
export function toPromise (fn) {
  return new Promise((resolve, reject) => {
    fn((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export function stringifyIfObject (any) {
  if (typeof any === 'object') {
    any = JSON.stringify(any);
  }
  return any;
}
