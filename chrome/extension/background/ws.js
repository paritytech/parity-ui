/* global chrome */
import isEqual from 'lodash.isequal';
import { keccak_256 } from 'js-sha3';
import logger from '../../utils/logger';

class Ws {

  constructor () {
    this.id = 1;
    this.callbacks = {};
    this.queue = []; // hold calls until ws is connected on init or if disconnected
    this.isConnected = false;
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.notifications.onClicked.addListener(this.onNotificationclick);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00'});
    this.reset();
    this.init();
  }

  init () {
    chrome.storage.local.get('sysuiToken', obj => {
      let { sysuiToken } = obj;

      if (!sysuiToken) {
        return logger.log('[BG WS] no sysuiToken in LS');
      }

      sysuiToken = JSON.parse(sysuiToken)
      const hash = this.hash(sysuiToken);

      try {
        this.ws = new WebSocket('ws://127.0.0.1:8180', hash);
      } catch (err) {
        logger.warn('cant connect to ws ', err);
      }
      this.ws.addEventListener('error', this.onWsError);
      this.ws.addEventListener('open', this.onWsOpen);
    });
  }

  reset () {
    // todo [adgo]- remove transactions from LS
    chrome.storage.local.set({ pendingTransactions: JSON.stringify([]) });
  }

  // when token changes in chrome LS
  onSysuiTokenChange = (changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return;
    }
    const newSysuiToken = JSON.parse(changes.sysuiToken.newValue);
    logger.log('[BG WS] sysuiToken changed! ', newSysuiToken);
    this.init();
  }

  // todo [adgo] - add comment: link to explanation
  hash (sysuiToken) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(sysuiToken + ':' + time) + '_' + time;
  }

  onWsOpen = () => {
    logger.log('[BG WS] connected');
    this.isConnected = true;
    this.executeQueue();
    this.setBadgeText('c'); // connected, will b replaced after fetching transactions for the first time
    chrome.storage.local.set({ pendingTransactions: JSON.stringify([]) });
    this.ws.addEventListener('close', this.onWsClose);
    this.ws.addEventListener('message', this.onWsMsg);
    this.fetchTransactions();
  }

  onWsError = (err) => {
    logger.warn('[BG WS] error ', err);
    this.reset();
    setTimeout(() => this.init(), 5000);
  }

  onWsClose = () => {
    logger.warn('[BG WS] closed!');
    this.errorOutCallbacks();
    this.isConnected = false;
    this.reset();
    this.init();
  }

  onWsMsg = msg => {
    try {
      msg = JSON.parse(msg.data);
    } catch (err) {
      return logger.warn('[BG WS] unknown msg from server: ', msg, err);
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
          logger.log('[BG WS] transactions changed');
          logger.log('[BG WS] previous (LS): ', transactionsLs);
          logger.log('[BG WS] current (WS): ', txsWs);

          if (txsWs.length > transactionsLs.length) {
            this.createNotification();
          }

          chrome.storage.local.set({ pendingTransactions: JSON.stringify(txsWs) });
        } catch (err) {
          logger.warn('[BG WS] bad data from extension local storage! object should contain transactions ', obj, err);
        } finally {
          this.timeoutFetchTransactions()
        }
      });
    });
  }

  send (method, params, callback) {
    if (!this.isConnected) {
      this.queue.push({ method, params, callback });
      logger.log('[BG WS] incoming msg when not connected, adding to queue');
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
    logger.log('[BG WS] executing queue: ', this.queue);
    this.queue.forEach(call => {
      this.send(call.method, call.params, call.callback);
    });
    this.queue = [];
  }

  errorOutCallbacks () {
    logger.log('[BG WS] erroring out callbacks: ', this.callbacks);
    for (const msgId in this.callbacks) {
      callbacks[msgId]('WS disconnected, cb cannot be called');
    }
    this.callbacks = {};
  }

  createNotification () {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'img/icon-16.png',
      title: 'New pending transcation',
      message: 'New pending transcation'
    });
  }

  onNotificationclick = notificationId => {
    chrome.notifications.clear(notificationId);
    // todo [adgo] - check if the popup is open in any window/tab
    // and focus on it instead of opening
    chrome.tabs.create({ url: "popup.html" });
  }

}

new Ws();
