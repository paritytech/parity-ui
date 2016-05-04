import React from 'react';

import {AccountChooser} from '../AccountsChooser/AccountsChooser';
import {DappContent} from '../DappContent/DappContent';

export class App extends React.Component {

  state = {
    accounts: [],
  };

  changeAccount (account) {
    this.setState({
      accounts: [account]
    });
  }

  render () {
    return (
      <div>
        <AccountChooser onChange={::this.changeAccount}/>
        <DappContent accounts={this.state.accounts} />
      </div>
    );
  }
}
