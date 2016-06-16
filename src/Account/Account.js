import React, { Component, PropTypes } from 'react';

import styles from './Account.css';

import Identicon from '../Identicon';
import AccountLink from '../AccountLink';

export default class Account extends Component {

  static propTypes = {
    className: PropTypes.string,
    address: PropTypes.string.isRequired,
    chain: PropTypes.string.isRequired,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]).isRequired,
    name: PropTypes.string
  };

  render () {
    const { address, balance, name, chain, className } = this.props;
    return (
      <div className={ `${styles.acc} ${className}` } title={ this.renderTitle(address) }>
        <Identicon address={ address } chain={ chain } />
        { this.renderName(address, name) }
        { this.renderBalance(balance) }
      </div>
    );
  }

  renderTitle = address => {
    if (this.props.name) {
      return address + ' ' + this.props.name;
    }

    return address;
  }

  renderBalance (balance) {
    if (balance === null) {
      return (
        <span> (...)</span>
      );
    }
    balance = +balance;
    return (
      <span> { balance.toFixed(2) } Eth</span>
    );
  }

  renderName (address, name) {
    if (!name) {
      return (
        <AccountLink address={ address } chain={ this.props.chain }>
          [{ this.shortAddress(address) }]
        </AccountLink>
      );
    }
    return (
      <AccountLink address={ address } chain={ this.props.chain } >
        <span>
          <span className={ styles.name }>{ name }</span>
          <span className={ styles.address }>[{ this.tinyAddress(address) }]</span>
        </span>
      </AccountLink>
    );
  }

  tinyAddress (address) {
    const len = address.length;
    return address.slice(2, 4) + '..' + address.slice(len - 2);
  }

  shortAddress (address) {
    const len = address.length;
    return address.slice(2, 8) + '..' + address.slice(len - 7);
  }

}
