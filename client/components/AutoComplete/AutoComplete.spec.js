import React from 'react';
import TestUtils from 'react-addons-test-utils';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AutoComplete from './index';

describe('components/AutoComplete', () => {
  describe('rendering', () => {
    const dataSource = ['abc', 'def', 'ghi'];
    const muiTheme = getMuiTheme({});
    let component;

    beforeEach(() => {
      component = TestUtils.renderIntoDocument(
        <MuiThemeProvider muiTheme={muiTheme}>
          <AutoComplete
            dataSource={dataSource}
            name='testComponent'
          />
        </MuiThemeProvider>
      );
    });

    it('renders the material AutoComplete component', () => {
      expect(component).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithTag(component, 'input')).to.be.ok;
    });
  });
});
