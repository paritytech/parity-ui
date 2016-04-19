'use strict';

const url = 'http://localhost:3000';

module.exports = {
  tags: ['statuspage'],
  'Navigate to status page' (client) {
    client.url(url).pause(1000);
  },

  'assert' (client) {
    client.expect.element('hgroup').to.be.present;
  },

  'change extradata' (client) {
    let extraData = '[data-test="Status-extra-data"]';
    client.expect.element(`${extraData} input:first-child`).to.be.visible;

    // First click
    client.click(`${extraData} input:first-child`);
    client.expect.element(`${extraData} input:first-child`).to.not.be.visible;
    client.expect.element(`${extraData} input:nth-child(2)`).to.be.visible;

    // Then modify the value
    client.setValue(
      `${extraData} input:first-child`,
      ['parity']
    );

    // Then blur
    client.click('body');
  },

  after (client) {
    client.end();
  }
};
