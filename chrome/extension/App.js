/* global chrome */
import { updateToken } from '../../app/actions/ws';

import React from 'react';
import ReactDOM from 'react-dom';

import Root from '../../app/containers/Root';
import { initApp } from '../../app/actions/app';
import './App.css';

import WsProvider from '../../app/providers/wsProvider';

const createStore = require('../../app/store/configureStore');
const store = createStore();
store.dispatch(initApp());
ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#root')
);

const wsProvider = new WsProvider(store);

chrome.storage.local.get('sysuiToken', initSysuiToken);

chrome.storage.onChanged.addListener(onSysuiTokenChange);

function initSysuiToken(obj) {
  console.log('initSysuiToken', obj)
  let { sysuiToken } = obj;

  if (!sysuiToken) {
    return;
  }

  sysuiToken = JSON.parse(sysuiToken)
	wsProvider.init(sysuiToken);
}

function onSysuiTokenChange(changes, namespace) {
  if (!(namespace === 'local' && 'sysuiToken' in changes)) {
    return;
  }
  const newSysuiToken = JSON.parse(changes.sysuiToken.newValue);
  wsProvider.init(newSysuiToken);
}
