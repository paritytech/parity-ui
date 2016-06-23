/* global chrome */
import isEqual from 'lodash.isequal';
import { keccak_256 } from 'js-sha3';
import logger from '../../utils/logger';
import BadgeTextAnimator from 'chrome-badge-animator';

class Ws {

  constructor () {
    this.id = 1;
    this.callbacks = {};
    this.queue = []; // hold calls until ws is connected on init or if disconnected
    this.isConnected = false;
    this.pendingTransactions = []
    chrome.runtime.onMessageExternal.addListener(this.onWebsiteMsg)
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00'});
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
    this.pendingTransactions = []
    this.setBadgeText('');
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
    if (msg.data === 'new_message') {
      this.fetchTransactions();
      return;
    }
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

  fetchTransactions () {
    if (this.isAnimatingIcon) {
      return;
    }

    this.send('personal_transactionsToConfirm', [], txsWs => {
      if (isEqual(txsWs, this.pendingTransactions)) {
        return;
      }
      logger.log('[BG WS] new pending transactions: ', txsWs);
      this.setBadgeText(txsWs.length);
      if (txsWs.length > this.pendingTransactions.length) {
        this.animateIcon(txsWs.length);
      }
      this.pendingTransactions = txsWs;
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

  animateIcon (txsLength) {
    this.isAnimatingIcon = true;
    // all parameters, apart from `text`, are optional
    const animator = new BadgeTextAnimator({
        text: 'New transaction pending',
        interval: 100, // the "speed" of the scrolling
        repeat: false,
        size: 6, // size of the badge
        cb: () => this.onAnimateIconEnd(txsLength)
    });
    animator.animate();
  }

  onAnimateIconEnd (txsLength) {
    this.setBadgeText(txsLength);
    this.isAnimatingIcon = false;
    this.fetchTransactions(); // in case there were new transactions while the con was animated
  }

  onWebsiteMsg (msg, sender, sendResponse) {
    if (msg !== 'version') {
      return;
    }
    const { version } = chrome.runtime.getManifest();
    sendResponse({ version });
  }

}

new Ws();
