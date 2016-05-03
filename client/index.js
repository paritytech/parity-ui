
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import localStore from 'store';
import Web3 from 'web3';

import './index.html';
import './index.css';
import 'dapp-styles/dapp-styles.less';
import './test.utils';

import middlewares from './middlewares';
import Routes from './routes';
import MuiThemeProvider from './components/MuiThemeProvider';

import configure from './store';
import { Web3Provider } from './provider/web3-provider';
import EthcoreWeb3 from './provider/web3-ethcore-provider';
import { initAppAction } from './actions/app';

const store = configure(middlewares);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Routes store={store} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

const web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
const ethcoreWeb3 = new EthcoreWeb3(web3);
new Web3Provider(web3, ethcoreWeb3, store).start();

(window || global).store = localStore;
(window || global).web3 = web3;

store.dispatch(initAppAction());
