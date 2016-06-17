import './App.css';
import app from 'parity-sysui-app';

tokenGetter (initToken => {
  app(initToken, tokenSetter, tokenListener)
})

function tokenGetter (cb) {
  chrome.storage.local.get('sysuiToken', obj => {
    let { sysuiToken } = obj;

    if (!sysuiToken) {
      return cb(null);
    }

    try {
      sysuiToken = JSON.parse(sysuiToken)
    } catch (err) {
      return console.warn('error parsing sysui token: ', sysuiToken, err);
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
      return console.warn('error parsing token ', token, err)
    }
    cb(token);
  });
}