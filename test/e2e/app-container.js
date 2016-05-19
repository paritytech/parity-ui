'use strict';

const url = 'http://localhost:3000/';
const utils = require('../utils');
const el = utils.el;

module.exports = {
  tags: ['App Container'],

  before (client) {
    client.url(url).pause(1000);
  },

  'Assert redirect to status page' (client) {
    client.assert.urlContains('/status');
  },

  'Assert header ui' (client) {
    client.expect.element(el('AppContainer-header')).to.be.present;
  },

  'Assert header nav' (client) {
    client.click(el('Header-rpc-link'));
    client.assert.urlContains('/rpc');
    client.click(el('Header-debug-link'));
    client.assert.urlContains('/debug');
    client.click(el('Header-home-link'));
    client.assert.urlContains('/status');
  },

  'Assert footer ui' (client) {
    client.expect.element(el('AppContainer-footer')).to.be.present;
  },

  'Assert footer logging toggle button' (client) {
    const logBtn = el('AppContainer-footer-log-button');
    client.click(logBtn);
    client.expect.element(el('ToastrContainer-toast-1')).text.to.contain('logging updated to false');
    client.click(logBtn);
    client.expect.element(el('ToastrContainer-toast-2')).text.to.contain('logging updated to true');
  },

  after (client) {
    client.end();
  }
};
