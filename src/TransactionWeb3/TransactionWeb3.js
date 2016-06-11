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
    value: PropTypes.any.isRequired,
    confirmTransaction: PropTypes.func.isRequired,
    rejectTransaction: PropTypes.func.isRequired
  }

  render () {
    const value = +this.context.web3.fromWei(this.props.value);
    return (
      <Transaction { ...this.props } value={ value } />
    );
  }

}
