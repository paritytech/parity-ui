import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Calls from './Calls';

describe.only('components/Calls', () => {
  describe('rendering (default)', () => {
    let component;

    beforeEach(() => {
      const calls = [];
      const actions = { fireRpc: () => true, copyToClipboard: () => true, selectRpcMethod: () => true };

      component = TestUtils.renderIntoDocument(
        <Calls calls={calls} actions={actions} />
      );
    });

    it('renders the component and container', () => {
      expect(component).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(component, 'calls-container')).to.be.ok;
    });

    it('renders no history (no calls are passed in)', () => {

    });

    it('renders no clear capabilities (no calls are passed in)', () => {

    });
  });

  describe('rendering (calls)', () => {

  });

  describe('actions', () => {

  });
});
