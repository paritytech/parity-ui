import './home.html';

import ReactDOM from 'react-dom';
import React from 'react';

import Web3Provider from './components/Web3Provider';
import AppsList from './components/AppsList';

if (!global.web3) {
  throw new Error('Create global web3 instance first!');
}

ReactDOM.render(
  <Web3Provider web3={global.web3}>
    <AppsList />
  </Web3Provider>,
  document.querySelector('#home')
);
