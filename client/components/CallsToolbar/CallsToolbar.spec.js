import React from 'react';
import TestUtils from 'react-addons-test-utils';

import CallsToolbar from './CallsToolbar';

describe('components/CallsToolbar', () => {
  describe('rendering (no call specified)', () => {
    let component;

    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <CallsToolbar />
      );
    });

    it('renders the component', () => {
      expect(component).to.be.ok;
    });
  });

  describe('rendering (with call)', () => {
    it('renders with callActions button', () => {

    });

    it('renders with callAction button', () => {

    });

    it('renders with copyToClipboard button (wrapped)', () => {

    });
  });

  describe('actions', () => {

  });
});
