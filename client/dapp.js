import './dapp.html';

import Web3 from 'web3';
import {FrameProvider} from './web3-frame-provider';

const httpProvider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(FrameProvider.withFallback(httpProvider));

const $el = document.getElementById('accounts');

setInterval(() => {
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      throw new Error(err);
    }
    $el.innerHTML = accounts;
  });
}, 2000);
