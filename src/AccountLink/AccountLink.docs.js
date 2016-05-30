import React, { Component } from 'react';
import AccountLink from './';

const acc = '0xe6378318641F99c2B6624700B3f342D1c6E84852';

export default class AccountLinkDocs extends Component {
  render () {
    return (
      <div>
        <h1>Account Link</h1>
        <AccountLink acc={ acc }>
          This should link to { acc }.
        </AccountLink>
      </div>
    );
  }
}
