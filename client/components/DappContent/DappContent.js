import React from 'react';
import styles from './styles.css';

import {Web3Component} from '../Web3Component/Web3Component';
import {Web3Forwarder} from './Web3Forwarder';

export class DappContent extends Web3Component {

  constructor (...args) {
    super(...args);
    this.forwarder = new Web3Forwarder(this);
  }

  render () {
    return (
      <iframe
        seamless
        className={styles.content}
        src={'dapp.html'}
        />
    );
  }

  static propTypes = {
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };
}
