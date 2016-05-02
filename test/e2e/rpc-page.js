'use strict';

const url = 'http://localhost:3000/#/rpc/';
const utils = require('../utils');
const el = utils.el;
const assertNav = utils.assertNav;
// const mckResponses = utils.mckResponses;
// const rpcMethods = require('../../client/data/rpc.json').methods;

module.exports = {
  tags: ['rpcpage'],
  'Navigate to rpc page' (client) {
    client.url(url).pause(1000);
  },

  'Assert redirect to calls' (client) {
    client.assert.urlContains('rpc/calls');
  },

  'Assert header ui' (client) {
    client.expect.element('hgroup').to.be.present;
    ['home', 'rpc', 'debug', 'apps', 'accounts'].map(assertNav.bind(client));
  },

  'Assert inner nav' (client) {
    const callsLink = el('RpcNav-rpc-calls-link');
    const docsLink = el('RpcNav-rpc-docs-link');
    // calls link active, rest not
    client.expect.element(callsLink).to.have.attribute('class').contain('activeNav');
    client.expect.element(docsLink).to.not.have.attribute('class').contain('activeNav');
    // navigate to docs
    client.click(docsLink);
    client.assert.urlContains('rpc/docs');
    // docs link active, rest not
    client.expect.element(docsLink).to.have.attribute('class').contain('activeNav');
    client.expect.element(callsLink).to.not.have.attribute('class').contain('activeNav');
    // // navigate back
    client.click(callsLink);
    client.assert.urlContains('rpc/calls');
    // calls link active, rest not
    client.expect.element(callsLink).to.have.attribute('class').contain('activeNav');
    client.expect.element(docsLink).to.not.have.attribute('class').contain('activeNav');
  },

  'Assert call history when there are no calls' (client) {
    // clear local storage
    client.injectScript('localStorage.removeItem("rpcPrevCalls");');
    // display message
    client.expect.element(el('Calls-empty')).to.be.visible;
    // remove icon shouldn't be rendered, and neither do any calls
    client.expect.element(el('Calls-remove')).to.not.be.present;
    client.expect.element('[data-test*="Calls-call*"]').to.not.be.present;
  },

  // todo [adgo] - fix interactions with material-ui fields
  // 'Assert form' (client) {
  //   const autocomplete = el('RpcCalls-autocomplete');
  //   const button = el('RpcCalls-fireRpc');
  //   const method = 'ethcore_setExtraData';
  //   const methodData = rpcMethods.find(m => m.name === method);
  //   const valueToSet = '123';
  //   const mckResponse = mckResponses.rpc.find(m => m.name === method).response;
  //   // clear value, set test method
  //   client.clearValue(autocomplete);
  //   client.click(autocomplete);
  //   client.keys(method.split(''));
  //   client.keys([client.Keys.DOWN_ARROW, client.Keys.DOWN_ARROW, client.Keys.ENTER]);
  //   // set value
  //   client.click(el(`RpcCalls-params_${methodData.params[0]}`));
  //   client.keys(valueToSet.split(''));
  //   // submit form
  //   client.click(button);
  //   // assert response
  //   client.expect(el('RpcCalls-prev-call-1')).to.be.present;
  //   client.expect(el('RpcCalls-prev-call-1', '> span:nth-child(1)')).text.to.contain('#1');
  //   client.expect(el('RpcCalls-prev-call-1', '> pre:nth-of-type(1)')).text.to.contain(`${method}(${valueToSet})`);
  //   client.expect(el('RpcCalls-prev-call-1', '> pre:nth-of-type(2)')).text.to.contain(mckResponse);
  // },

  after (client) {
    client.end();
  }
};
