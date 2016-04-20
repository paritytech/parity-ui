'use strict';

const mockedResponses = require('../mocked-responses.json');
const url = 'http://localhost:3000';

module.exports = {
  tags: ['statuspage'],
  'Navigate to status page' (client) {
    client.url(url).pause(1000);
    client.expect.element('hgroup').to.be.present;
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
