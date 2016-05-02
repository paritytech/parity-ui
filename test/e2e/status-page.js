'use strict';

const mockedResponses = require('../mocked-responses.json');
const url = 'http://localhost:3000';
const utils = require('../utils');
const el = utils.el;
const assertNav = utils.assertNav;

module.exports = {
  tags: ['statuspage'],
  'Navigate to status page' (client) {
    client.url(url).pause(1000);
  },

  'Assert ui' (client) {
    client.expect.element('hgroup').to.be.present;
    ['home', 'rpc', 'debug', 'apps', 'accounts'].map(assertNav.bind(client));
    client.expect.element(el('Status-mining')).to.be.present;
    client.expect.element(el('Status-settings')).to.be.present;
    client.expect.element(el('StatusPage-footer')).to.be.present;
  },

  'Assert mining settings' (client) {
    [
      { selector: 'author', name: 'eth_coinbase' },
      { selector: 'extra-data', name: 'ethcore_extraData' },
      { selector: 'min-gas-price', name: 'ethcore_minGasPrice' },
      { selector: 'gas-floor-target', name: 'ethcore_gasFloorTarget' }
    ].map(assertMiningSettings.bind(client));
  },

  'Assert status' (client) {
    [
      { selector: 'best-block', name: 'eth_blockNumber' },
      { selector: 'hashrate', name: 'eth_hashrate' }
    ].map(assertStatus.bind(client));
  },

  'Assert network' (client) {
    [
      { selector: 'chain', name: 'ethcore_netChain' },
      { selector: 'network-port', name: 'ethcore_netPort' },
      { selector: 'peers', name: 'net_peerCount' }
    ].map(assertNetwork.bind(client));
  },

  'Assert rpc' (client) {
    [
      { selector: 'rpc-enabled', name: 'enabled' },
      { selector: 'rpc-interface', name: 'interface' },
      { selector: 'rpc-port', name: 'port' }
    ].map(assertRpc.bind(client));
  },

  // 'change extradata' (client) {
  //   const submit = el('MiningSettings-extra-data-submit');
  //   const cancel = el('MiningSettings-extra-data-cancel');
  //   const edit = el('MiningSettings-extra-data-edit');
  //   const reset = el('MiningSettings-extra-data-reset');
  //   const input = el('MiningSettings-extra-data', 'input');
  //   const val = mockedResponses.rpc.find(method => method.name === 'ethcore_extraData').formattedResponse;
  //   const newVal = 'Parity//213.beta/awesometesty/ubuntu-29';
  //   // submit/cancel are hidden on load, edit and reset button displayed but not visible
  //   client.expect.element(submit).to.not.be.present;
  //   client.expect.element(cancel).to.not.be.present;
  //   client.expect.element(edit).to.be.present;
  //   client.expect.element(edit).to.not.be.visible;
  //   client.expect.element(reset).to.be.present;
  //   client.expect.element(reset).to.not.be.visible;
  //   // display edit and reset button (sleep for transition delay)
  //   client.moveToElement(input, 0, 0);
  //   client.waitForElementVisible(edit, 220, false);
  //   client.expect.element(edit).to.be.visible;
  //   client.expect.element(reset).to.be.visible;
  //   // switch to edit mode
  //   client.click(edit);
  //   // submit/cancel displayed, edit button hidden
  //   client.expect.element(submit).to.be.present;
  //   client.expect.element(cancel).to.be.present;
  //   client.expect.element(edit).to.not.be.present;
  //   client.expect.element(reset).to.not.be.present;
  //   // modify the value and cancel, expect initial value
  //   client.clearValue(input);
  //   client.setValue(input, newVal);
  //   client.click(cancel);
  //   client.expect.element(input).to.have.value.that.equals(val);
  //   client.expect.element(submit).to.not.be.present;
  //   client.expect.element(cancel).to.not.be.present;
  //   client.expect.element(edit).to.be.present;
  //   client.expect.element(reset).to.be.present;
  //   // modify the value and click outside, expect new value, action buttons present
  //   client.moveToElement(input, 0, 0);
  //   client.waitForElementVisible(edit, 220, false);
  //   client.click(edit);
  //   client.clearValue(input);
  //   client.setValue(input, newVal);
  //   client.click(el('Status-mining')); // outside click
  //   client.expect.element(input).to.have.value.that.equals(newVal);
  //   client.expect.element(submit).to.be.present;
  //   client.expect.element(cancel).to.be.present;
  //   client.expect.element(edit).to.not.be.present;
  //   client.expect.element(reset).to.not.be.present;
  //   // submit, expect new value, edit button hidden
  //   client.clearValue(input);
  //   client.setValue(input, newVal);
  //   client.click(submit);
  //   client.expect.element(input).to.have.value.that.equals(newVal);
  //   client.expect.element(submit).to.not.be.present;
  //   client.expect.element(cancel).to.not.be.present;
  //   client.expect.element(edit).to.be.present;
  //   client.expect.element(reset).to.be.present;
  // },

  after (client) {
    client.end();
  }
};

function assertMiningSettings (method) {
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  let expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`MiningSettings-${method.selector}`, 'input')).to.have.value.that.equals(expected);
}

function assertStatus (method) {
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  let expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`Status-${method.selector}`)).text.to.contain(expected);
}

function assertNetwork (method) {
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  let expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`Status-${method.selector}`, 'input')).to.have.value.that.contain(expected);
}

function assertRpc (method) {
  const mockedMethod = mockedResponses.rpc.find(m => m.name === 'ethcore_rpcSettings');
  let expected = mockedMethod.response[method.name];
  if (method.name === 'enabled') {
    expected = expected ? 'yes' : 'no';
  }
  this.expect.element(el(`Status-${method.selector}`, 'input')).to.have.value.that.contain(expected);
}
