import React, { Component } from 'react';

import TransactionWeb3 from './';

const transaction1 = {
  id: '001x0',
  from: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  to: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  gas: 10,
  gasPrice: 20,
  nonce: 2,
  value: '0',
  confirmTransaction: args => console.log('Transaction confirmed:', args),
  rejectTransaction: id => console.log('Transaction rejected: ', id)
};

const transaction2 = {
  id: '002x0',
  from: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  to: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  gas: 10,
  gasPrice: 20,
  nonce: 2,
  data: '0x234lkjglfdkgj',
  value: '0x9184e72a',
  confirmTransaction: args => console.log('Transaction confirmed:', args),
  rejectTransaction: id => console.log('Transaction rejected: ', id)
};

const containerStyle = { width: 700 }; // mimic sysui chrome extension width

export default class TransactionWeb3Docs extends Component {
  render () {
    return (
      <div style={ containerStyle }>
        <h1>Transaction</h1>
        <TransactionWeb3 { ...transaction1 } />
        <TransactionWeb3 { ...transaction2 } />
      </div>
    );
  }
}
