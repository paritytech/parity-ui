/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';

import Root from '../../app/containers/Root';
import { initApp } from '../../app/actions/app';
import './App.css';

const createStore = require('../../app/store/configureStore');
const store = createStore();
store.dispatch(initApp());
ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#root')
);