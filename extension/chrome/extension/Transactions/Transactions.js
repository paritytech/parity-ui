import { isEqual } from 'lodash';
import logger from '../../utils/logger';
import Ws from '../../utils/Ws';
import BadgeTextAnimator from 'chrome-badge-animator';

export default class Transactions {

  constructor () {
    this.ws = new Ws({
      path: '127.0.0.1:8180',
      onMsg: ::this.onWsMsg,
      onOpen: ::this.fetchPendingTransactions,
      onClose: ::this.reset,
      onError: ::this.reset
    });
    this.pendingTransactions = [];
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00' });
    chrome.runtime.onMessageExternal.addListener(this.onWebsiteMsg);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00' });
  }

  init (token) {
    this.ws.init(token);
  }

  reset = () => {
    this.pendingTransactions = [];
    this.setBadgeText('');
  }

  // when token changes in chrome LS
  onSysuiTokenChange = (changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return;
    }
    const newSysuiToken = JSON.parse(changes.sysuiToken.newValue);
    logger.log('[BG WS] sysuiToken changed! ', newSysuiToken);
    this.init(newSysuiToken);
  }

  fetchPendingTransactions = () => {
    if (this.isBadgeAnimated) {
      return; // avoid badge flicker in middle of animation
    }
    this.send('personal_transactionsToConfirm', [], txsWs => {
      if (isEqual(txsWs, this.pendingTransactions)) {
        return;
      }
      logger.log('[BG WS] transactions changed', txsWs);
      this.setBadgeText(txsWs.length);
      if (txsWs.length > this.pendingTransactions.length) {
        this.animateBadge(txsWs.length);
      }
      this.pendingTransactions = txsWs;
    });
  }

  send (method, params, callback) {
    const payload = {
      jsonrpc: '2.0',
      method, params
    };
    this.ws.send(payload, callback);
  }

  setBadgeText (text) {
    text = String(text);
    if (text === '0') {
      text = '';
    }
    chrome.browserAction.setBadgeText({ text });
  }

  animateBadge (txsLength) {
    this.isBadgeAnimated = true;
    const animator = new BadgeTextAnimator({
      text: 'New transaction pending',
      interval: 100, // the "speed" of the scrolling
      repeat: false,
      size: 6,
      cb: () => this.onBadgeIconEnd(txsLength)
    });
    animator.animate();
  }

  onBadgeIconEnd (txsLength) {
    this.setBadgeText(txsLength);
    this.isBadgeAnimated = false;
    this.fetchPendingTransactions(); // in case there were new transactions while the con was animated
  }

  onWebsiteMsg (msg, sender, sendResponse) {
    if (msg !== 'version') {
      return;
    }
    const { version } = chrome.runtime.getManifest();
    sendResponse({ version });
  }

  onWsMsg (msg) {
    if (msg.data !== 'new_message') {
      return;
    }
    this.fetchPendingTransactions();
  }

}
