import Cols from './cols';
import {isUsingSubdomains, appLink} from '../appLink';
import EthereumWalletCompatibility from './eth-wallet-compat';

export default class {

  constructor (storage) {
    this.storage = storage;
    this.ethWallet = new EthereumWalletCompatibility();
    this.listeners = [];

    this.ethWallet.onAccountsNamesChanged((names) => {
      this.setAccountsNames(names);
    });
    // Override names at start
    this.getAccountsNames((accounts) => {
      this.ethWallet.setAccountsNames(accounts);
    });
  }

  onAccountsNames (cb) {
    this.getAccountsNames(cb);
    this.listeners.push(cb);
    return () => {
      const idx = this.listeners.indexOf(cb);
      this.listeners.splice(idx, 1);
    };
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
    this.ethWallet.setAccountsNames(names);
    this.listeners.map(cb => cb(names));
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

