import React from 'react';

import {Web3Component} from '../Web3Component/Web3Component';
import {appLink} from '../appLink';

import styles from './styles.css';

const DEFAULT_NETWORK = 'homestead';

export default class StatusLine extends Web3Component {

  state = {
    isSyncing: false,
    latestBlock: '1234',
    highestBlock: '1234',
    connectedPeers: 25,
    network: 'homestead'
  }

  render () {
    if (this.state.isSyncing) {
      return this.renderSyncing();
    }

    return (
      <div className={styles.status}>
        <ul className={styles.info}>
          <li>{this.state.connectedPeers} peers</li>
          <li>#{this.state.latestBlock}</li>
          <li>{this.renderNetwork()}</li>
          <li><a href={appLink('status')}>more</a></li>
        </ul>
      </div>
    );
  }

  renderNetwork () {
    const {network} = this.state;
    if (network !== DEFAULT_NETWORK) {
      return (
        <span className={styles.alert}>
          {network}
        </span>
      );
    }
    return (
      <span>{network}</span>
    );
  }

  renderSyncing () {
    // TOOD [ToDr] Add progress bar
    return (
      <div className={styles.status}>
        <span>
          Syncing...
        </span>
      </div>
    );
  }

}
