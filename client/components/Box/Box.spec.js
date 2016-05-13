import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Box from './Box';

describe('components/Box', () => {
  describe('rendering', () => {
    const title = 'test title';
    let component;

    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <Box
          title={title}
        />
      );
    });

    it('renders the component', () => {
      expect(component).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(component, 'dapp-box')).to.be.ok;
    });

    it('renders the title', () => {
      expect(TestUtils.findRenderedDOMComponentWithTag(component, 'h2').innerHTML).to.equal(title);
    });

    it('renders no default value', () => {
      expect(() => TestUtils.findRenderedDOMComponentWithTag(component, 'h1')).to.throw;
    });
  });

  describe('contents', () => {
    const value = 'test value';
    const child = 'this is the child value';

    let component;

    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <Box
          title='title'
          value={value}
        >
          <pre>{child}</pre>
        </Box>
      );
    });

    it('renders the value', () => {
      expect(TestUtils.findRenderedDOMComponentWithTag(component, 'h1').innerHTML).to.equal(value);
    });

    it('wraps the children', () => {
      expect(TestUtils.findRenderedDOMComponentWithTag(component, 'pre').innerHTML).to.equal(child);
    });
  });
});
