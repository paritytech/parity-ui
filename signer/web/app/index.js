import './index.html';

const app = window.paritySigner; // exposed by app.js

initApp();

function initApp () {
  const initToken = window.localStorage.getItem('sysuiToken');
  app(initToken, tokenSetter, tokenListener, window.location.host);
}

function tokenSetter (token, cb) {
  window.localStorage.setItem('sysuiToken', token);
  window.location.reload();
}

function tokenListener (cb) {} // noop
