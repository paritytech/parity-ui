const bluebird = require('bluebird');
global.Promise = bluebird;

import Transactions from './Transactions';
import ProxyManager from './ProxyManager';

init();

function init () {
  const proxyManager = new ProxyManager();
  proxyManager.init();
  const transactions = new Transactions();

  chrome.storage.local.get('sysuiToken', obj => {
    let { sysuiToken } = obj;
    if (!sysuiToken) {
      logger.log('[BG WS] no sysuiToken in LS');
      return;
    }
    sysuiToken = sysuiToken.replace(/"/g, '');
    transactions.init(sysuiToken);
  });
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'storage',
]);
promisifyAll(chrome.storage, [
  'local',
]);

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise(resolve => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}
