import React, { Component } from 'react';
import AccountLink from './';

const acc = '0x52D0BF77acE2d1fB2370267911Ff7Df9CdB4af2E';

export default class AccountLinkDocs extends Component {
  render () {
    return (
      <div>
        <h1>Account Link</h1>
        <AccountLink acc={ acc } chain={ 'morden' }>
          This should link to { acc }.
        </AccountLink>
      </div>
    );
  }
}
