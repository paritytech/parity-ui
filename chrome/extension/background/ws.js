/* global chrome */
import isEqual from 'lodash.isequal';
import logger from '../../utils/logger';
import { SIGNER_META_TITLE, POPUP_URL } from '../../constants/constants';
import { weiHexToEthString } from '../../utils/formatters';
import Ws from '../../utils/ws';

class BgWs {

  constructor () {
    this.ws = new Ws({
      openCb: this.pollTransactions, 
      errorCb: this.reset
    });
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    chrome.notifications.onClicked.addListener(this.onNotificationclick);
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

  pollTransactions = () => {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      if (isEqual(txsWs, this.transactions)) {
        return;
      }
      logger.log('[BG WS] transactions changed', txsWs);
      this.setBadgeText(txsWs.length);
      if (txsWs.length > transactionsLs.length) {
        this.createNotification(txsWs);
      }
      this.transactions = txsWs;
      setTimeout(() => this.pollTransactions, 2000);
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

  // todo [adgo] - handle multiple new pending transactions
  createNotification (wsTxs) {
    const transaction = wsTxs[wsTxs.length - 1];
    let { value, from, to } = transaction.transaction;
    to = to || 'Deploy Contract';
    value = weiHexToEthString(value);
    chrome.notifications.create({
      type: 'list',
      iconUrl: 'img/icon-48.png',
      title: 'New pending transcation',
      message: '', // doesn't affect anything, chrome will throw error without it
      contextMessage: value + ' [ETH]',
      priority: 2,
      items: [
        {
          title: 'From',
          message: from
        },
        {
          title: 'To',
          message: to
        }
      ]
    });
  }

  onNotificationclick = notificationId => {
    chrome.notifications.clear(notificationId);
    this.getActiveSignerTab(tab => {
      if (tab) {
        chrome.tabs.update(tab.id, { active: true });
      } else {
        chrome.tabs.create({ url: POPUP_URL });
      }
    })
  }

  getActiveSignerTab (cb) {
    chrome.tabs.query({ title: SIGNER_META_TITLE }, tabs => {
      cb(tabs[0]);
    });
  }

}

const bgWs = new BgWs();

chrome.storage.local.get('sysuiToken', obj => {
  let { sysuiToken } = obj;
  if (!sysuiToken) {
    return logger.log('[BG WS] no sysuiToken in LS');
  }
  sysuiToken = JSON.parse(sysuiToken);
  bgWs.init(sysuiToken);
});
