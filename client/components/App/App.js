import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

import styles from './styles.css';

import {AccountChooser} from '../AccountsChooser/AccountsChooser';
import {DappContent} from '../DappContent/DappContent';

export class App extends React.Component {

  state = {
    accounts: [],
    url: 'local://dapp.html',
    hints: [
      'local://dapp.html',
      'local://index.html',
      'parity://dapp',
      'ipfs://dapp',
      'parity://test',
      'http://ethcore.github.io/parity-web-ui/dapp.html'
    ]
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
        <div className={styles.nav}>
          <div style={{flex: 1}}>
            <AutoComplete
              fullWidth
              hintText='http://...'
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
