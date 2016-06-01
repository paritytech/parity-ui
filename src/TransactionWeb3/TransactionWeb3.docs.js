import React, { Component } from 'react';

import Web3Provider from '../Web3Provider';
import Web3 from 'web3';
const http = new Web3.providers.HttpProvider('/rpc/');
const web3 = new Web3(http);

import Transaction from './';

const transaction = {
  id: 1,
  from: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  to: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  gas: 10,
  gasPrice: 20,
  nonce: 2,
  value: 2000,
  confirmTransaction: args => console.log('Transaction confirmed:', args),
  rejectTransaction: id => console.log('Transaction rejected: ', id)
};

export default class TransactionDocs extends Component {
  render () {
    return (
      <div>
        <h1>Transaction</h1>
        <Web3Provider web3={ web3 }>
          <Transaction { ...transaction } />
        </Web3Provider>
      </div>
    );
  }
}
