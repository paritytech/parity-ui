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
    ethValue: +this.context.web3.fromWei(this.props.value),
    chain: 'homestead', // avoid required prop loading warning
    fromBalance: 0, // avoid required prop loading warning
    toBalance: this.props.to ? 0 : null // avoid required prop loading warning in case there's a to address
  }

  render () {
    const { fromBalance, toBalance, ethValue, chain } = this.state;
    return (
      <TransactionPending
        { ...this.props }
        ethValue={ ethValue }
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

    this.fetchBalance(to, 'to');
  }

  fetchBalance (address, owner, next) {
    this.context.web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        console.warn('err fetching balance for ', address, err);
        return next && next();
      }
      this.setState({
        [owner + 'Balance']: +this.context.web3.fromWei(balance)
      });

      next && next();
    });
  }

}

export default Web3Compositor(TransactionPendingWeb3);
