import React, { Component } from 'react';

import Transaction from './';

const transaction = {
  id: '00x1',
  from: '0x52D0BF77acE2d1fB2370267911Ff7Df9CdB4af2E',
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
        <Transaction { ...transaction } />
      </div>
    );
  }
}
