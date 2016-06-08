
import localStorage from './safeLocalStorage';

const accountPattern = /minimongo__ethereum_accounts__/;

export default class EthereumWalletCompatibility {

  lastAccounts = null;
  callbacks = [];
  storage = localStorage;

  constructor () {
    this.startDetectingChanges();
  }

  startDetectingChanges () {
    const detectChange = (next) => {
      const accounts = this.getWalletAccounts().reduce((all, key) => {
        all[key] = this.storage.getItem(key);
        return all;
      }, {});

      const accountsStr = JSON.stringify(accounts);
      if (this.lastAccounts === accountsStr) {
        next();
        return;
      }

      const last = this.lastAccounts;
      this.lastAccounts = accountsStr;
      if (last === null) {
        next();
        return;
      }

      const names = Object.keys(accounts)
        .map(k => accounts[k])
        .map(v => JSON.parse(v))
        .reduce((memo, v) => {
          memo[v.data.address] = v.data.name;
          return memo;
        }, {});
      this.fireChanged(names);
      next();
    };

    const next = () => {
      setTimeout(() => {
        detectChange(next);
      }, 2000);
    };

    next();
  }

  fireChanged (accounts) {
    this.callbacks.map((cb) => {
      cb(accounts);
    });
  }

  getWalletAccounts () {
    return this.storage.keys().filter((key) => accountPattern.test(key));
  }

  setWalletAccountsNames (names) {
    this.getWalletAccounts().map((key, idx) => {
      try {
        const val = JSON.parse(this.storage.getItem(key));
        // modify the name
        val.data.name = names[val.data.address] || `Account ${idx + 1}`;
        this.storage.setItem(key, JSON.stringify(val));
      } catch (e) {
        // Just skip invalid items
        return;
      }
    });
  }

  onAccountsNamesChanged (callback) {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx === -1) {
        return;
      }
      this.callbacks.splice(idx, 1);
    };
  }
}
