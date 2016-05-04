import './index.html';
import './index.css';

import ReactDOM from 'react-dom';
import React from 'react';

import Web3 from 'web3';

import {Web3Provider} from './components/Web3Provider/Web3Provider';
import {App} from './components/App/App';

const web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));

ReactDOM.render(
  <Web3Provider web3={web3}>
    <App />
  </Web3Provider>,
  document.getElementById('root')
);
