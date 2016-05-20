import {Cols} from './cols';
import {isUsingSubdomains, appLink} from '../appLink';

export default class {

  constructor (storage) {
    this.storage = storage;
  }

  getLastAccount (cb) {
    this.storage.getItem('lastAccount', cb);
  }

  saveLastAccount (acc, cb) {
    this.storage.setItem('lastAccount', acc, cb);
  }

  getAccountsNames (cb) {
    this.storage.getItem('accountsNames', (names) => {
      try {
        cb(JSON.parse(names));
      } catch (e) {
        cb({});
      }
    });
  }

  setAccountsNames (names, cb) {
    this.storage.setItem('accountsNames', JSON.stringify(names), cb);
  }

  static cols = null;

  static crossOrigin () {
    const loc = window.location;
    const home = appLink('home');
    const origin = isUsingSubdomains() ? `${loc.protocol}${home}` : `${loc.protocol}//${loc.host}`;

    const cols = this.cols || new Cols(home, origin).addToDom();
    this.cols = cols;

    return new this(cols);
  }
}

