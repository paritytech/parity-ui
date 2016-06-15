import React, { Component } from 'react';

import TransactionPending from './';

const transaction = {
  id: '00x1',
  from: '0x52D0BF77acE2d1fB2370267911Ff7Df9CdB4af2E',
  to: '0xe6378318641F99c2B6624700B3f342D1c6E84852',
  nonce: 2,
  gasPrice: 20,
  gas: 2100,
  data: '0xa',
  value: '0x9184e72a',
  onConfirm: args => console.log('Transaction confirmed:', args),
  onReject: id => console.log('Transaction rejected: ', id)
};

const containerStyle = { width: 700 }; // mimic sysui chrome extension width

export default class TransactionDocs extends Component {
  render () {
    return (
      <div style={ containerStyle }>
        <h1>Transaction</h1>
        <TransactionPending { ...transaction } />
      </div>
    );
  }
}
