import React, { PropTypes } from 'react';

import Transaction from '../Transaction';
import Web3Component from '../Web3Component';

export default class TransactionWeb3 extends Web3Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    gasPrice: PropTypes.any,
    gas: PropTypes.any,
    to: PropTypes.string,
    nonce: PropTypes.number,
    value: PropTypes.string.isRequired, // wei
    confirmTransaction: PropTypes.func.isRequired,
    rejectTransaction: PropTypes.func.isRequired
  }

  render () {
    debugger
    return (
      <Transaction { ...this.props } />
    );
  }

}
