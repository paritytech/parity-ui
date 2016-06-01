import React, { Component } from 'react';
import Web3Provider from '../Web3Provider';
import Web3 from 'web3';
const http = new Web3.providers.HttpProvider('/rpc/');
const web3 = new Web3(http);

import Account from './';

const address = '0xe6378318641F99c2B6624700B3f342D1c6E84852';

export default class AccountDocs extends Component {
  render () {
    return (
      <div>
        <h1>Account Web 3</h1>
        <Account address={ address } />
      </div>
    );
  }
}
