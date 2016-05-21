import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import '../../test';

import Call from './Call';

describe('components/Call', () => {
  const call = { callIdx: 123, callNo: 456, name: 'eth_call', params: '', response: '' };

  describe('rendering', () => {
    let rendered;

    before(() => {
      const noop = sinon.stub();

      rendered = shallow(
        <Call
          call={call}
          setActiveCall={noop}
        />
      );
    });

    it('renders the component', () => {
      expect(rendered).to.be.ok;
      expect(rendered).to.have.exactly(1).descendants(`div[data-test="Call-call-${call.callNo}"]`);
    });
  });
});
