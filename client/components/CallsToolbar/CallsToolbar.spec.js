import React from 'react';
import { shallow } from 'enzyme';

import '../../test';

import CallsToolbar from './CallsToolbar';

describe('components/CallsToolbar', () => {
  const callEl = { offsetTop: 0 };
  const containerEl = { scrollTop: 0, clientHeight: 0, scrollHeight: 999 };

  describe('rendering (no call)', () => {
    let rendered;

    before(() => {
      const call = null;

      rendered = shallow(<CallsToolbar call={call} callEl={callEl} containerEl={containerEl} />);
    });

    it('does not render the component', () => {
      expect(rendered).to.not.have.descendants('[data-test="CallsToolbar-button-more"]');
    });
  });

  describe('rendering', () => {
    const call = { callNo: 456, name: 'eth_call', params: '', response: '' };
    let rendered;
    let btncontainer;

    before(() => {
      rendered = shallow(<CallsToolbar call={call} callEl={callEl} containerEl={containerEl} />);
      btncontainer = rendered.find('[data-test="CallsToolbar-button-container"]');
    });

    it('renders the More button', () => {
      expect(rendered).to.have.descendants('[data-test="CallsToolbar-button-more"]');
    });

    it('renders the Set button', () => {
      expect(btncontainer).to.have.descendants('[data-test="CallsToolbar-button-setCall"]');
    });

    it('renders the Fire button', () => {
      expect(btncontainer).to.have.descendants('[data-test="CallsToolbar-button-makeCall"]');
    });

    it('renders the Copy button', () => {
      expect(btncontainer).to.have.descendants('[data-test="CallsToolbar-copyCallToClipboard"]');
    });
  });
});
