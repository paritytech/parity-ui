import React from 'react';
import styles from './styles.css';

import {TransactionConfirmation} from '../TransactionConfirmation/TransactionConfirmation';
import {Web3Component} from '../Web3Component/Web3Component';
import {Web3Forwarder} from './Web3Forwarder';
import {parseAddress} from './address';

export class DappContent extends Web3Component {

  state = {
    sendingTransaction: false
  };

  constructor (...args) {
    super(...args);
    this.forwarder = new Web3Forwarder(this);
  }

  render () {
    const address = parseAddress(this.props.url);

    return (
      <div>
        <iframe
          seamless
          className={styles.content}
          src={address.url}
          onLoad={(ev) => this.forwarder.onLoad(ev.target, this.props.url)}
          />
        <TransactionConfirmation
          open={this.state.sendingTransaction}
          transaction={this.state.transaction}
          onAbort={::this.abortTransaction}
          onConfirm={::this.confirmTransaction}
          />
      </div>
    );
  }

  abortTransaction () {
    this.state.cb('aborted');
  }

  confirmTransaction () {
    this.state.cb(null);
  }

  static propTypes = {
    url: React.PropTypes.string.isRequired,
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };
}
