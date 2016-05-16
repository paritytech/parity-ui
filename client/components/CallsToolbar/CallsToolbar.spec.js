import React from 'react';
import { shallow } from 'enzyme';

import '../../test';

import CallsToolbar from './CallsToolbar';

describe('components/CallsToolbar', () => {
  describe('rendering', () => {
    const call = { callNo: 456, name: 'eth_call', params: '', response: '' };
    let rendered;

    before(() => {
      const callEl = { offsetTop: 0 };
      const containerEl = { scrollTop: 0 };

      rendered = shallow(<CallsToolbar call={call} callEl={callEl} containerEl={containerEl} />);
    });

    it('renders the component and container', () => {
      expect(rendered).to.be.ok;
    });
  });
});
