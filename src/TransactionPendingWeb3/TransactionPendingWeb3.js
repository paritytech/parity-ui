import React, { Component, PropTypes } from 'react';

import TransactionPending from '../TransactionPending';
import Web3Compositor from '../Web3Compositor';

class TransactionPendingWeb3 extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // wei hex
    gasPrice: PropTypes.number.isRequired, // Gwei
    gas: PropTypes.number.isRequired, // wei
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    to: PropTypes.string, // undefined if it's a contract
    data: PropTypes.string,
    nonce: PropTypes.number,
    className: PropTypes.string
  };

  state = {
    ethValueNumber: +this.context.web3.fromWei(this.props.value),
    ethValue: this.context.web3.toBigNumber(this.context.web3.fromWei(this.props.value)).toPrecision(5),
    weiValue: this.context.web3.toBigNumber(this.props.value).toFormat(0),
    chain: 'homestead', // avoid required prop loading warning
    fromBalance: null, // avoid required prop loading warning
    toBalance: null // avoid required prop loading warning in case there's a to address
  }

  render () {
    const { fromBalance, toBalance, ethValue, chain, weiValue } = this.state;
    return (
      <TransactionPending
        { ...this.props }
        ethValue={ ethValue }
        weiValue={ weiValue }
        fromBalance={ fromBalance }
        chain={ chain }
        toBalance={ toBalance }
      />
    );
  }

  // todo [adgo] - call next() only after all CBs are executed
  onTick (next) {
    this.fetchChain();
    this.fetchBalances(next);
  }

  fetchChain () {
    this.context.web3.ethcore.getNetChain((err, chain) => {
      if (err) {
        return console.warn('err fetching chain', err);
      }
      this.setState({ chain });
    });
  }

  fetchBalances (next) {
    const { from, to } = this.props;
    this.fetchBalance(from, 'from', next);

    if (!to) {
      return;
    }

    this.fetchBalance(to, 'to', next);
  }

  fetchBalance (address, owner, next) {
    this.context.web3.eth.getBalance(address, (err, balance) => {
      next(err);

      if (err) {
        console.warn('err fetching balance for ', address, err);
        return;
      }

      this.setState({
        [owner + 'Balance']: Number(this.context.web3.fromWei(balance))
      });
    });
  }

}

export default Web3Compositor(TransactionPendingWeb3);
