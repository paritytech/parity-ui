import React from 'react';

import {AccountChooser} from '../AccountsChooser/AccountsChooser';

import styles from './styles.css';

export default class extends React.Component {

  state = {
    accounts: [],
    allAccounts: [],
  };

  changeAccount (account) {
    this.setState({
      accounts: [account]
    });
  }

  onAllAccounts (accounts) {
    this.setState({
      allAccounts: accounts
    });
  }

  render () {
    return (
      <div className={styles.topbar}>
        <h4 className={styles.header}>Identity @ Parity</h4>
        <AccountChooser
          onChange={::this.changeAccount}
          onAllAccounts={::this.onAllAccounts}
          />
      </div>
    );
  }
}
