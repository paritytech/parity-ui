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
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  }

  state = {
    ethValue: +this.context.web3.fromWei(this.props.value)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      const ethValue = +this.context.web3.fromWei(nextProps.value);
      this.setState({ ethValue });
    }
  }

  render () {
    return (
      <Transaction { ...this.props } ethValue={ this.state.ethValue } />
    );
  }

}
