'use strict';

const mockedResponses = require('../mocked-responses.json');
const url = 'http://localhost:3000';

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
      // { selector: 'chain', name: '' },
      // { selector: 'network-port', name: '' },
      // { selector: 'rpc-enabled', name: '' },
      // { selector: 'rpc-interface', name: '' },
      // { selector: 'rpc-port', name: 'eth_hashrate' }
      { selector: 'peers', name: 'net_peerCount' }
    ].map(assertNetwork.bind(client));
  },

  'change extradata' (client) {
    // submit/cancel are hidden on load, edit button displayed
    client.expect.element(el('MiningSettings-extra-data-submit')).to.not.be.present;
    client.expect.element(el('MiningSettings-extra-data-cancel')).to.not.be.present;
    client.expect.element(el('MiningSettings-extra-data-edit')).to.be.present;
    // switch to edit mode
    client.click(el('MiningSettings-extra-data-edit'));
    // submit/cancel displayed, edit button hidden
    client.expect.element(el('MiningSettings-extra-data-submit')).to.be.present;
    client.expect.element(el('MiningSettings-extra-data-cancel')).to.be.present;
    client.expect.element(el('MiningSettings-extra-data-edit')).to.not.be.present;

    // Then modify the value
    // todo [adgo] 20.04.2016 - implement after resolving https://github.com/tomusdrw/eth-node-status-page/issues/26
  },

  after (client) {
    client.end();
  }
};

function el (base, innerSelector) {
  let selector = `[data-test="${base}"]`;
  if (innerSelector) {
    selector += ` ${innerSelector}`;
  }
  return selector;
}

function assertMiningSettings (method) {
  let expected;
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`MiningSettings-${method.selector}`, 'input')).to.have.value.that.equals(expected);
}

function assertStatus (method) {
  let expected;
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`Status-${method.selector}`)).text.to.contain(expected);
}

function assertNetwork (method) {
  let expected;
  const mockedMethod = mockedResponses.rpc.find(m => m.name === method.name);
  expected = mockedMethod.formattedResponse || mockedMethod.response;
  this.expect.element(el(`Status-${method.selector}`, 'input')).to.have.value.that.contain(expected);
}

function assertNav (link) {
  const selector = `Header-${link}-link`;
  this.expect.element(el(selector)).to.be.present;
}
