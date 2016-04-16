
export default class localStorageMiddleware {

  constructor (_localStore) {
    this._localStore = _localStore;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'unshift toLocalStorage') {
        return next(action);
      }

      const {key, value} = action.payload;
      const newArr = [value].concat(this._localStore.get(key) || []);
      this._localStore.set(key, newArr);
      return next(action);
    };
  }
}
