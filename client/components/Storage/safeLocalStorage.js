
let warningDisplayed = false;

function displayWarning (e) {
  if (warningDisplayed) {
    return;
  }
  warningDisplayed = true;
  console.warn('Your browser does not support localStorage. Data will not be persisted.', e);
}

export default class SafeLocalStorage {

  static keys () {
    try {
      return Object.keys(window.localStorage);
    } catch (e) {
      displayWarning(e);
      return [];
    }
  }

  static setItem (key, value, cb) {
    try {
      return window.localStorage.setItem(key, value);
    } catch (e) {
      return displayWarning(e);
    } finally {
      if (cb) {
        cb(true);
      }
    }
  }

  static getItem (key, cb) {
    let ret = null;
    try {
      ret = window.localStorage.getItem(key);
    } catch (e) {
      displayWarning(e);
      // just return undefined
      ret = undefined;
    }
    if (cb) {
      cb(ret);
    }
    return ret;
  }

}
