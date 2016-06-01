import React, { Component } from 'react';

import Account from './';

const address = '0x52D0BF77acE2d1fB2370267911Ff7Df9CdB4af2E';
const balance = 2345892754628937456;

export default class AccountDocs extends Component {
  render () {
    return (
      <div>
        <h1>Account</h1>
        <Account address={ address } balance={ balance } />
      </div>
    );
  }
}
