import './index.html';
import 'dapp-styles/dapp-styles.less';

import './test.utils';

import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import localStore from 'store';
import request from 'browser-request';
import Web3 from 'web3';

import StatusPage from './containers/StatusPage';
import DebugPage from './containers/DebugPage';
import AccountsPage from './containers/AccountsPage';
import AppListPage from './containers/AppListPage';
import RpcPage from './containers/RpcPage';

import Middlewares from './middleware';
import configure from './store';
import {Web3Provider} from './provider/web3-provider';
import EthcoreWeb3 from './provider/web3-ethcore-provider';
import {initAppAction} from './actions/app';

const web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
const ethcoreWeb3 = new EthcoreWeb3(web3);
const web3Interactions = new Middlewares.WebInteractions(web3, ethcoreWeb3);
const rpcMiddleware = new Middlewares.Rpc(request);
const localStorageMiddleware = new Middlewares.LocalStorage();

const storeMiddlewares = [Middlewares.logger, web3Interactions.toMiddleware(), rpcMiddleware.toMiddleware(), localStorageMiddleware.toMiddleware()];

const store = configure(storeMiddlewares);
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={`/`} component={StatusPage} />
      <Route path={`/debug`} component={DebugPage} />
      <Route path={`/accounts`} component={AccountsPage} />
      <Route path={`/apps`} component={AppListPage} />
      <Route path={`/rpc`} component={RpcPage} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

new Web3Provider(web3, ethcoreWeb3, store).start();
store.dispatch(initAppAction());

(window || global).store = localStore;
(window || global).web3 = web3;
