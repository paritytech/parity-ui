/* global chrome */
import isEqual from 'lodash.isequal';
import logger from '../../utils/logger';
import Ws from '../../utils/ws';

class BgWs {

  constructor () {
    this.ws = new Ws({
      onOpen: this.fetchPendingTransactions, 
      onClose: this.reset,
      onError: this.reset
    });
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f00'});
    this.reset();
  }

  init (token) {
    this.ws.init(token);
  }

  reset = () => {
    this.transactions = [];
    this.setBadgeText(0);
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
    this.send('personal_transactionsToConfirm', [], txsWs => {
      if (isEqual(txsWs, this.transactions)) {
        return;
      }
      logger.log('[BG WS] transactions changed', txsWs);
      this.setBadgeText(txsWs.length);
      if (txsWs.length > this.transactions.length) {
        this.animateBadge(txsWs);
      }
      this.transactions = txsWs;
      setTimeout(() => this.fetchPendingTransactions, 2000);
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

}

const bgWs = new BgWs();

chrome.storage.local.get('sysuiToken', obj => {
  let { sysuiToken } = obj;
  if (!sysuiToken) {
    return logger.log('[BG WS] no sysuiToken in LS');
  }
  sysuiToken = sysuiToken.replace(/"/g, '');
  bgWs.init(sysuiToken);
});
