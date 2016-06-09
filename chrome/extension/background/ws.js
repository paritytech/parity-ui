/* global chrome */
import isEqual from 'lodash.isequal';
import { keccak_256 } from 'js-sha3';

// init: set listener for LS token change
// init: fetch token from LS

// try to connect with token
// if correct, start polling transactions, set badge text to number, set transactions to LS
// not correct, display set badge to !
// on disconnect reconnect from LS 
// (think about what to do on disconnect due to token change)

class Ws {

  constructor () {
    this.id = 1;
    this.callbacks = {};
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.runtime.onMessage.addListener(this.onChromeMsg);
    
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

      try {
        this.ws = new WebSocket('ws://localhost:8180', hash);
      } catch (err) {
        console.warn('cant connect to ws ', err);
      }
      this.ws.addEventListener('error', this.onWsError);
      this.ws.addEventListener('open', this.onWsOpen);
    });
  }

  reset () {
    chrome.storage.local.set({ isConnected: JSON.stringify(false) });
    chrome.storage.local.set({ pendingTransactions: JSON.stringify([]) });
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
    this.setBadgeText('c'); // connected, will b replaced after fetching transactions for the first time
    chrome.storage.local.set({ isConnected: JSON.stringify(true) });
    chrome.storage.local.set({ pendingTransactions: JSON.stringify([]) });
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
    setTimeout(::this.fetchTransactions, 2000);
  }

  fetchTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      this.setBadgeText(txsWs.length)
      chrome.storage.local.get('pendingTransactions', obj => {
        try {
          const transactionsLs = JSON.parse(obj.pendingTransactions);
          if (isEqual(txsWs, transactionsLs)) {
            return;
          }
          console.log('[BG WS] transactions changed')
          console.log('[BG WS] previous (LS): ', transactionsLs)
          console.log('[BG WS] current (WS): ', txsWs)
          chrome.storage.local.set({ pendingTransactions: JSON.stringify(txsWs) });
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
    this.ws.send(payload);
  }

  setBadgeText (text) {
    text = String(text);
    chrome.browserAction.setBadgeText({ text });
  }

  onChromeMsg = (request, sender, cb) => {
    console.log('[BG WS] incoming chrome msg', request);
    if (!request.type === 'ws') {
      return;
    }
    const { method, params } = request;
    this.send(method, params, cb);
    return true; // needed for chrome async messaging cb, more info on: https://developer.chrome.com/extensions/runtime#event-onMessage
  }

}

new Ws();
