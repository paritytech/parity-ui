import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

import {AccountChooser} from '../AccountsChooser/AccountsChooser';
import {DappContent} from '../DappContent/DappContent';

export class App extends React.Component {

  state = {
    accounts: [],
    url: 'dapp.html',
    hints: ['dapp.html', 'http://ethcore.github.io/parity-web-ui/dapp.html']
  };

  changeAccount (account) {
    this.setState({
      accounts: [account]
    });
  }

  onAddressChange (address) {
    this.setState({
      url: address
    });
  }

  onUpdateInput (d) {
  
  }

  render () {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1}}>
            <AutoComplete
              fullWidth={true}
              hintText="http://..."
              searchText={this.state.url}
              dataSource={this.state.hints}
              onUpdateInput={::this.onUpdateInput}
              onNewRequest={::this.onAddressChange}
              />
          </div>
          <div>
            <AccountChooser onChange={::this.changeAccount}/>
          </div>
        </div>
        <DappContent
          url={this.state.url}
          accounts={this.state.accounts}
          />
      </div>
    );
  }
}
