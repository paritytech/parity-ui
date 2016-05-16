export default class {

  constructor (storage) {
    this.storage = storage || window.localStorage;
  }

  getLastAccount () {
    return this.storage[id('lastAccount')];
  }

  saveLastAccount (acc) {
    this.storage[id('lastAccount')] = acc;
  }

  getAccountsNames () {
    const names = this.storage[id('accountsNames')];
    try {
      return JSON.parse(names);
    } catch (e) {
      return {};
    }
  }

  setAccountsNames (names) {
    this.storage[id('accountsNames')] = JSON.stringify(names);
  }

}

function id (str) {
  return `parity-${str}`;
}
