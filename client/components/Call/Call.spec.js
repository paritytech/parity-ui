import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import '../../test';

import Call from './Call';

describe('components/Call', () => {
  const call = { callIdx: 123, callNo: 456, name: 'eth_call', params: '', response: '' };

  describe('rendering', () => {
    let rendered;

    beforeEach(() => {
      const noop = sinon.stub();

      rendered = shallow(
        <Call
          call={call}
          callIdx={call.callIdx}
          setCallElement={noop}
          setHoverIdx={noop}
        />
      );
    });

    it('renders the component', () => {
      expect(rendered).to.be.ok;
      expect(rendered).to.have.exactly(1).decendents(`div[data-test="Call-call-${call.callNo}"]`);
    });
  });

  describe('interactions', () => {
    let setCallElement;
    let setHoverIdx;
    let rendered;

    beforeEach(() => {
      setCallElement = sinon.stub();
      setHoverIdx = sinon.stub();

      rendered = mount(
        <Call
          call={call}
          callIdx={call.callIdx}
          setCallElement={setCallElement}
          setHoverIdx={setHoverIdx}
        />
      );
    });

    it('renders the component', () => {
      expect(rendered).to.be.ok;
      expect(rendered).to.have.exactly(1).decendents(`div[data-test="Call-call-${call.callNo}"]`);
    });
  });
});
