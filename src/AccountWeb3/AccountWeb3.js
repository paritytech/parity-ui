import React, { PropTypes } from 'react';

import Web3Component from '../Web3Component';
import Account from '../Account';

export default class AccountWeb3 extends Web3Component {

  static propTypes = {
    className: PropTypes.string,
    address: PropTypes.string.isRequired,
    name: PropTypes.string
  };

  state = {
    balance: null,
    chain: 'homestead'
  };

  componentDidMount () {
    this.fetchChain();
    this.fetchBalance(this.props.address);
  }

  componentWillReceiveProps (newProps) {
    this.fetchBalance(newProps.address);
  }

  fetchBalance (address) {
    this.context.web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        return console.error('error fetching balance for: ', address, err);
      }

      if (this.state.balance === balance) {
        return;
      }

      this.setState({
        balance
      });
    });
  }

  fetchChain () {
    this.context.web3.ethcore.getNetChain((err, chain) => {
      if (err) {
        return console.warn('error fetching chain: ', err);
      }
      if (chain === this.state.chain) {
        return;
      }

      this.setState({ chain });
    });
  }

  render () {
    let { address, name, className } = this.props;
    let { chain, balance } = this.state;
    balance = this.context.web3.fromWei(balance);
    address = this.context.web3.toChecksumAddress(address);
    return (
      <Account
        className={ className }
        balance={ balance }
        address={ address }
        chain={ chain }
        name={ name }
      />
    );
  }

}
