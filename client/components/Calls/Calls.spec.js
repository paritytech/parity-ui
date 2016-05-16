import React from 'react';
import { shallow } from 'enzyme';

import '../../test';

import Calls from './Calls';

describe('components/Calls', () => {
  describe('rendering (no calls)', () => {
    let rendered;

    beforeEach(() => {
      const calls = [];

      rendered = shallow(<Calls calls={calls} />);
    });

    it('renders the component and container', () => {
      expect(rendered).to.be.ok;
      expect(rendered).to.have.className('calls-container');
    });

    it('renders no calls', () => {
      expect(rendered.find('div[data-test="Calls-empty-wrapper"]')).to.have.exactly(1).descendants('h3');
    });

    it('renders no clear button', () => {
      expect(rendered.find('a[data-test="Calls-remove"]')).to.not.exist;
    });

    it('renders an attached CallsToolbar', () => {
      expect(rendered).to.have.exactly(1).descendants('CallsToolbar');
    });
  });

  describe('rendering (calls supplied)', () => {
    let rendered;

    beforeEach(() => {
      const calls = [
        { callNo: 0, name: 'eth_call', params: '', response: '' },
        { callNo: 1, name: 'eth_sendTransaction', params: '', response: '' }
      ];

      rendered = shallow(<Calls calls={calls} />);
    });

    it('renders calls', () => {
      expect(rendered.find('div[data-test="Calls-empty-wrapper"]')).to.not.exist;
      expect(rendered.find('div.row div')).to.have.exactly(2).descendants('div[data-test]');
    });

    it('renders the clear button', () => {
      expect(rendered).to.have.exactly(1).descendants('a[data-test="Calls-remove"]');
    });
  });
});
