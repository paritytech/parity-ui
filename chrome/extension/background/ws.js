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
    this.queue = []; // hold calls until ws is connected on init or if disconnected
    this.isConnected = false;
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
        this.ws = new WebSocket('ws://127.0.0.1:8180', hash);
      } catch (err) {
        console.warn('cant connect to ws ', err);
      }
      this.ws.addEventListener('error', this.onWsError);
      this.ws.addEventListener('open', this.onWsOpen);
    });
  }

  reset () {
    // todo [adgo]- remove transactions from LS
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
    console.log('[BG WS] connected');
    this.isConnected = true;
    this.executeQueue();
    this.setBadgeText('c'); // connected, will b replaced after fetching transactions for the first time
    chrome.storage.local.set({ pendingTransactions: JSON.stringify([]) });
    this.ws.addEventListener('close', this.onWsClose);
    this.ws.addEventListener('message', this.onWsMsg);
    this.fetchTransactions();
  }

  onWsError = (err) => {
    console.warn('[BG WS] error ', err);
    this.reset();
    setTimeout(() => this.init(), 5000);
  }

  onWsClose = () => {
    console.warn('[BG WS] closed!');
    this.errorOutCallbacks();
    this.isConnected = false;
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
    if (!this.isConnected) {
      this.queue.push({ method, params, callback });
      console.log('[BG WS] incoming msg when not connected, adding to queue');
      return;
    }
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
    if (text === '0') {
      text = '';
    }
    chrome.browserAction.setBadgeText({ text });
  }

  executeQueue () {
    console.log('[BG WS] executing queue: ', this.queue);
    this.queue.forEach(call => {
      this.send(call.method, call.params, call.callback);
    });
    this.queue = [];
  }

  errorOutCallbacks () {
    console.log('[BG WS] erroring out callbacks: ', this.callbacks);
    for (const msgId in this.callbacks) {
      callbacks[msgId]('WS disconnected, cb cannot be called');
    }
    this.callbacks = {};
  }

}

new Ws();
