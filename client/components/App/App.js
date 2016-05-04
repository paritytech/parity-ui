import React from 'react';

import {AccountChooser} from '../AccountsChooser/AccountsChooser';
import {DappContent} from '../DappContent/DappContent';

export class App extends React.Component {
  render () {
    return (
      <div>
        <AccountChooser />
        <DappContent />
      </div>
    );
  }
}
