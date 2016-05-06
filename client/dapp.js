import './dapp.html';

import Web3 from 'web3';
import {FrameProvider} from './web3-frame-provider';

const httpProvider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(FrameProvider.withFallback(httpProvider));

setInterval(() => {
  web3.eth.getAccounts(withError((accounts) => {
    web3.defaultAccount = accounts[0];
    redrawAccounts(accounts);

    web3.eth.getBalance(accounts[0], withError((balance) => {
      redrawBalance(balance);
    }));
  }));
}, 2000);

const $amount = el('#value');
const $recipient = el('#address');

handleForm();

function handleForm () {
  const $form = el('#form');

  $amount.addEventListener('input', redrawSummary);
  $recipient.addEventListener('input', redrawSummary);
  $form.addEventListener('submit', submitTransaction);

  redrawSummary();
}

function submitTransaction (ev) {
  ev.preventDefault();

  const from = web3.defaultAccount;
  const to = $recipient.value;
  const value = $amount.value;

  const $btn = el('#form button');
  const val = $btn.innerHTML;
  $btn.disabled = true;
  $btn.innerHTML = 'Sending...';

  function revertButton () {
    $btn.disabled = false;
    $btn.innerHTML = val;
  }

  try {
    web3.eth.sendTransaction({
      from, to, value
    }, withError((tx) => {
      revertButton();
      window.alert('Transaction has been sent. Hash: ' + tx);
    }));
  } catch (e) {
    revertButton();
    window.alert(e);
  }
}

function redrawSummary () {
  const $summary = el('#summary');
  const from = web3.defaultAccount;
  const to = $recipient.value;
  const value = $amount.value;
  if (!value || !to || !from) {
    $summary.innerHTML = 'Fill out all fields.';
    return;
  }

  $summary.innerHTML = `
  You will transfer <strong>${$amount.value} ETH</strong>
  from <strong>${web3.defaultAccount}</strong>
  to <strong>${$recipient.value}</strong>.
  `;
}

function redrawAccounts (accounts) {
  el('#accounts').innerHTML = accounts;
}
function redrawBalance (balance) {
  el('#balance').innerHTML = web3.fromWei(balance).toFixed(2);
}

function el (sel) {
  return document.querySelector(sel);
}

function withError (func) {
  return (err, resp) => {
    if (err) {
      throw new Error(err);
    }
    func(resp);
  };
}
