/* global chrome */
import isEqual from 'lodash.isequal';
import { keccak_256 } from 'js-sha3';

// init: set listener for LS token change
// init: fetch token from LS

// try to connect with token
// if correct, start polling transactions, set badge text to number, set transactions to LS
// not correct, display set badge to !
// on error, reconnect from LS
// on disconnect reconnect from LS 
// (think about what to do on disconnect due to token change)

class Ws {

  constructor () {
    this.id = 1;
    this.callbacks = {};
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    this.reset();
    this.init();
  }

  init () {
    chrome.storage.local.get('sysuiToken', obj => {
      let { sysuiToken } = obj;

      if (!sysuiToken) {
        return console.log('[BG WS] no sysuiToken in LS');
      }

      sysuiToken = JSON.parse(sysuiToken)
      const hash = this.hash(sysuiToken);

      this.ws = new WebSocket('ws://localhost:8180', hash);
      this.ws.addEventListener('error', this.onWsError);
      this.ws.addEventListener('open', this.onWsOpen);
    });
  }

  reset () {
    chrome.storage.local.set({ isConnected: JSON.stringify(false) });
    chrome.storage.local.set({ transactions: JSON.stringify([]) });
    this.setBadgeText('!');
  }

  // when token changes in chrome LS
  onSysuiTokenChange = (changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return;
    }
    const newSysuiToken = JSON.parse(changes.sysuiToken.newValue);
    console.log('[BG WS] sysuiToken changed! ', newSysuiToken);
    this.init();
  }

  // todo [adgo] - add comment: link to explanation
  hash (sysuiToken) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(sysuiToken + ':' + time) + '_' + time;
  }

  onWsOpen = () => {
    this.setBadgeText('c'); // connected, will b replaced by fetching transactions ...
    chrome.storage.local.set({ isConnected: JSON.stringify(true) });
    chrome.storage.local.set({ transactions: JSON.stringify([]) });
    this.ws.addEventListener('disconnect', this.onWsDisconnect);
    this.ws.addEventListener('message', this.onWsMsg);
    this.fetchTransactions();
  }

  onWsError = (err) => {
    console.warn('[BG WS] error ', err);
    chrome.storage.local.set({ sysuiToken: null });
    this.reset();
  }

  onWsDisconnect = () => {
    console.warn('[BG WS] disconnect!');
    this.reset();
    this.init();
  }

  onWsMsg = msg => {
    console.log('msg', msg);
    try {
      msg = JSON.parse(msg.data);
    } catch (err) {
      return console.warn('[BG WS] unknown msg from server: ', msg, err);
    }
    const cb = this.callbacks[msg.id];
    delete this.callbacks[msg.id];
    if (!cb) {
      // Ignoring - no one is waiting for that response.
      return;
    }
    // callback otherwise
    cb(msg.result);
  }

  timeoutFetchTransactions = () => {
    // todo [adgo] - check if need to add :: binding to fetchTransactions here
    setTimeout(::this.fetchTransactions, 2000);
  }

  fetchTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      console.log('[BG WS] txs: ', txsWs);
      this.setBadgeText(txsWs.length)
      chrome.storage.local.get('transactions', obj => {
        try {
          const transactionsLs = JSON.parse(obj.transactions);
          console.log('[BG WS] chrome LS txs: ', transactionsLs);
          if (isEqual(txsWs, transactionsLs)) {
            return;
          }
          chrome.storage.local.set({ transactions: JSON.stringify(txsWs) });
        } catch (err) {
          console.warn('[BG WS] bad data from extension local storage! object should contain transactions ', obj);
        } finally {
          this.timeoutFetchTransactions()
        }
      });
    });
  }

  send (method, params, callback) {
    const id = this.id;
    this.id++;
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id, method, params
    });
    this.callbacks[id] = callback;
    console.log('payload', payload)
    this.ws.send(payload);
  }

  setBadgeText (text) {
    text = String(text);
    chrome.browserAction.setBadgeText({ text });
  }

}

new Ws();
