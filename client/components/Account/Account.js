import React from 'react';

import styles from './styles.css';

import {Web3Component} from '../Web3Component/Web3Component';
import {Identicon} from '../Identicon/Identicon';

export class Account extends Web3Component {

  state = {
    balance: null
  };

  constructor (...args) {
    super(...args);
    this.fetchBalance(this.props.address);
  }

  componentWillReceiveProps (newProps) {
    this.fetchBalance(newProps.address);
  }

  fetchBalance (address) {
    this.context.web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        return;
      }

      this.setState({
        balance
      });
    });
  }

  render () {
    const acc = this.props.address;
    const address = this.context.web3.toChecksumAddress(acc);
    return (
      <div className={styles.account} title={address}>
        <Identicon seed={acc} />
        <span className={styles.address}>
          {this.shortAddress(address)}
        </span>
        {this.renderBalance()}
      </div>
    );
  }

  renderBalance () {
    const { balance } = this.state;
    if (balance === null) {
      return (
        <span> (...)</span>
      );
    }
    const val = this.context.web3.fromWei(balance);
    return (
      <span> ({val.toFixed(2)} Eth)</span>
    );
  }

  shortAddress (acc) {
    const len = acc.length;
    return acc.slice(0, 8) + '...' + acc.slice(len - 8);
  }

  static propTypes = {
    address: React.PropTypes.string.isRequired
  };

}
