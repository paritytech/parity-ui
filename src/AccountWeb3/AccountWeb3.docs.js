import React, { Component } from 'react';

import AccountWeb3 from './';

const address = '0xe6378318641F99c2B6624700B3f342D1c6E84852';

export default class AccountWeb3Docs extends Component {
  render () {
    return (
      <div>
        <h1>Account Web 3</h1>
        <AccountWeb3 address={ address } />
      </div>
    );
  }
}
