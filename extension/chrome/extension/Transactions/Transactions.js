import { isEqual } from 'lodash';
import logger from '../../utils/logger';
import Ws from '../../utils/Ws';
import BadgeTextAnimator from 'chrome-badge-animator';

export default class Transactions {

  constructor () {
    this.ws = new Ws({
      path: '127.0.0.1:8180',
      onMsg: ::this.onWsMsg,
      onOpen: ::this.invokeOnOpen,
      onClose: ::this.reset,
      onError: ::this.reset
    });
    this.onOpenListeners = [];
    this.pendingTransactionsLen = 0;
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00' });
  }

  onOpen (listener) {
    this.onOpenListeners.push(listener);

    return () => {
      const idx = this.onOpenListeners.indexOf(listener);
      if (idx === -1) {
        return;
      }
      // Remove listener
      this.onOpenListeners.splice(idx, 1);
    };
  }

  invokeOnOpen () {
    this.fetchPendingTransactions();
    this.onOpenListeners.map(listener => listener());
  }

  init (token) {
    logger.log('[BG WS] init with token:', token);
    this.ws.init(token);
  }

  reset = () => {
    this.pendingTransactionsLen = 0;
    this.setBadgeText('');
  }

  // when token changes in chrome LS
  onSysuiTokenChange = (changes, namespace) => {
    logger.log(`[BG WS] changes in LS namespace: ${namespace};`, changes);
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return;
    }
    let token = null;
    try {
      token = changes.sysuiToken.newValue.replace(/["']/g, '');
    } catch (err) {
      logger.warn('[BG WS] error parsing token: ', changes.sysuiToken.newValue, 'returning null');
    }
    this.init(token);
  }

  fetchPendingTransactions = () => {
    if (this.isBadgeAnimated) {
      return; // avoid badge flicker in middle of animation
    }

    // TODO [todr] would be good to use Web3 instead?
    ['personal_transactionsToConfirm', 'personal_requestsToConfirm'].map(method => {
      this.send(method, [], (err, txsWs) => {
        if (err) {
          if (err.message !== 'Method not found') {
            logger.warn('[BG WS] error fetching pending transactions:', err);
          }
          return;
        }

        const txsWsLen = txsWs.length;
        if (isEqual(txsWsLen, this.pendingTransactionsLen)) {
          return;
        }

        logger.log('[BG WS] transactions changed', txsWs);
        this.setBadgeText(txsWsLen);
        if (txsWsLen > this.pendingTransactionsLen) {
          this.animateBadge(txsWsLen);
        }

        this.pendingTransactionsLen = txsWsLen;
      });
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

  onWsMsg (msg) {
    if (msg.data !== 'new_message') {
      return;
    }
    this.fetchPendingTransactions();
  }

}
