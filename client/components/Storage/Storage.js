import {Cols} from './cols';
import {isUsingSubdomains, appLink} from '../appLink';
import EthereumWalletCompatibility from './eth-wallet-compat';

export default class {

  constructor (storage) {
    this.storage = storage;
    this.ethWallet = new EthereumWalletCompatibility();
    this.ethWallet.onAccountsNamesChanged((accounts) => {
      this.setAccountsNames(names);
    });
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

