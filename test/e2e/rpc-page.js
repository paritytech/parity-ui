'use strict';

// const mockedResponses = require('../mocked-responses.json');
const url = 'http://localhost:3000/#/rpc/';
const utils = require('../utils');
const el = utils.el;
const assertNav = utils.assertNav;

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
    client.expect.element(el('RpcCalls-no-prev-calls')).to.be.visible;
    // remove icon shouldn't be rendered, and neither do any calls
    client.expect.element(el('prev-calls-remove')).to.not.be.present;
    client.expect.element('[data-test*="prev-calls-remove"]').to.not.be.present;
  },

  after (client) {
    client.end();
  }
};
