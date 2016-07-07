import 'reset-css/reset.css';
import './App.css';
import logger from '../utils/logger';
import app from 'parity-signer';

initApp();

function initApp () {
  tokenGetter (initToken => {
    app(initToken, tokenSetter, tokenListener, '127.0.0.1:8180');
  });
}

function tokenGetter (cb) {
  chrome.storage.local.get('sysuiToken', obj => {
    let { sysuiToken } = obj;

    if (!sysuiToken) {
      return cb(null);
    }

    try {
      sysuiToken = JSON.parse(sysuiToken)
    } catch (err) {
      return logger.warn('[APP] error parsing sysui token: ', sysuiToken, err);
    }

    cb(sysuiToken);
  });
}

function tokenSetter (token, cb) {
  chrome.storage.local.set({ sysuiToken: JSON.stringify(token) }, cb);
}

function tokenListener (cb) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return cb(false);
    }
    let token;
    try {
      token = JSON.parse(changes.sysuiToken.newValue);
    } catch (err) {
      return logger.warn('[APP] error parsing token ', token, err)
    }
    cb(token);
  });
}
