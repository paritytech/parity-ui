
import localStore from 'store';

export default class localStorageMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'unshift toLocalStorage') {
        return next(action);
      }

      const {key, value} = action.payload;
      this.unshift(key, value);
      return next(action);
    };
  }

  // remove if/when PR is accepted: https://github.com/marcuswestin/store.js/pull/153
  unshift (key, value) {
    const newArr = [value].concat(localStore.get(key) || []);
    localStore.set(key, newArr);
  }
}
