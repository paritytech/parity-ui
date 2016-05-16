export default class {
  
  constructor(storage) {
    this.storage = storage || window.localStorage;
  }

  getLastAccount () {
    return this.storage[id('lastAccount')];
  }

  saveLastAccount (acc) {
    this.storage[id('lastAccount')] = acc;
  }

  getNameForAddress (address) {
    return;
  }

}

function id (str) {
  return `parity-${str}`;
}
