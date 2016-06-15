import React, { Component } from 'react';

import Account from '../../../Account';
import styles from './AccountPage';

import accountsData from './accounts.data';

export default class AccountPage extends Component {

  render () {
    return (
      <div>
        <h1>Account</h1>
        <p>
          Some explaining here ...
        </p>
        { this.renderAccounts() }
      </div>
    );
  }

  renderAccounts () {
    return accountsData.map(acc => {
      return (
        <div className={ styles.account }>
          <h3>{ acc._desc }</h3>
          <Account { ...acc } key={ acc.address } />
        </div>
      )
    });
  }

}
