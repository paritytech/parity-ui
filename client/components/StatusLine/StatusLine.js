import React from 'react';

import {Web3Component} from '../Web3Component/Web3Component';
import {appLink} from '../appLink';

import styles from './styles.css';

const DEFAULT_NETWORK = 'homestead';

export default class StatusLine extends Web3Component {

  state = {
    isReady: false,
    isSyncing: false,
    latestBlock: '1234',
    startingBlock: '1234',
    highestBlock: '1234',
    connectedPeers: 25,
    network: 'homestead'
  }

  onTick () {
    const {web3} = this.context;
    const handleError = (f) => (err, data) => {
      if (err) {
        console.error(err);
        this.setState({
          isError: true
        });
        return;
      }
      this.setState({
        isError: false
      });
      f(data);
    };
    // Syncing
    web3.eth.getSyncing(handleError(syncing => {
      if (!syncing) {
        this.setState({
          isSyncing: false
        });
        return;
      }

      this.setState({
        isSyncing: true,
        startingBlock: syncing.startingBlock,
        highestBlock: syncing.highestBlock
      });
    }));
    // Latest Block
    web3.eth.getBlockNumber(handleError(blockNumber => this.setState({
      latestBlock: blockNumber
    })));
    // peers
    web3.net.getPeerCount(handleError(peers => this.setState({
      connectedPeers: peers
    })));

    // TODO get network name
  }

  render () {
    if (this.state.isReady) {
      return (
        <div className={styles.status}>...</div>
      );
    }

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
    const {latestBlock, highestBlock} = this.state;
    return (
      <div className={styles.status}>
        <span>
          Syncing #{latestBlock}/{highestBlock}...
        </span>
      </div>
    );
  }

}
