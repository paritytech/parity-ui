import React, { Component } from 'react';

import AccountLink from '../../../AccountLink';
import styles from './AccountLinkPage.css';

import accountLinkPageData from './AccountLinkPage.data';

export default class AccountLinkPage extends Component {

  render () {
    return (
      <div>
        <h1>Account Link</h1>
        { this.renderAccountsLinks() }
      </div>
    );
  }

  renderAccountsLinks () {
    return accountLinkPageData.map(acc => {
      return (
        <div className={ styles.accountLinksContainer } key={ acc.address }>
          <AccountLink { ...acc } className={ styles.link }>
            { acc.address }
          </AccountLink>
          { this.renderAccountLinkInfo(acc) }
        </div>
      );
    });
  }

  renderAccountLinkInfo (acc) {
    return (
      <div className={ styles.accountLinksInfo }>
        <div>Chain: { acc.chain }</div>
        <div>Address: { acc.address }</div>
      </div>
    );
  }

}
