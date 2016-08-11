import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import LinearProgress from 'material-ui/LinearProgress';

import { appLink } from '../../utils/appLink';

import styles from './StatusLine.css';

import { DEFAULT_NETWORK } from '../../constants/rpc';

class StatusLine extends Component {

  static propTypes = {
    isReady: PropTypes.bool.isRequired,
    isSyncing: PropTypes.bool.isRequired,
    latestBlock: PropTypes.number.isRequired,
    startingBlock: PropTypes.number.isRequired,
    highestBlock: PropTypes.number.isRequired,
    peers: PropTypes.shape({
      active: PropTypes.number.isRequired,
      connected: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    network: PropTypes.string.isRequired
  }

  render () {
    const { isReady, isSyncing, highestBlock, peers, latestBlock } = this.props;
    if (!isReady) {
      return (
        <div className={ styles.status }>...</div>
      );
    }

    // TODO [ToDr] Because eth_syncing is a bit broken now we will be checking if there
    // is actually anything to sync before displaying the progress bar.
    // See: https://github.com/ethcore/parity/issues/1110
    if (isSyncing && latestBlock < highestBlock) {
      return this.renderSyncing();
    }

    return (
      <div className={ styles.status }>
        <ul className={ styles.info }>
          <li>
            <span title='Active Peers'>{ leftPad(peers.active) }</span>
            /<span title='Connected Peers'>{ leftPad(peers.connected) }</span>
            /<span title='Max (Target) Peers'>{ peers.max }</span>
            &nbsp;peers
          </li>
          <li>#{ toNiceNumber(latestBlock) }</li>
          <li>{ this.renderNetwork() }</li>
          <li><a href={ appLink('status') }>more</a></li>
        </ul>
      </div>
    );
  }

  renderNetwork () {
    const { network } = this.props;
    if (network !== DEFAULT_NETWORK) {
      return (
        <span className={ styles.alert }>
          { network }
        </span>
      );
    }
    return (
      <span>{ network }</span>
    );
  }

  renderSyncing () {
    const { startingBlock, latestBlock, highestBlock } = this.props;
    const val = 100 * (latestBlock - startingBlock) / (highestBlock - startingBlock);
    return (
      <div className={ styles.status } title='Syncing...'>
        <LinearProgress
          style={ s.progress }
          value={ val }
          mode={ 'determinate' }
          />
        #{ toNiceNumber(latestBlock) }/{ toNiceNumber(highestBlock) }...
      </div>
    );
  }
}

function toNiceNumber (num) {
  return numeral(num).format('0,0');
}

function leftPad (num) {
  if (num < 10) {
    return ` ${num}`;
  }

  return num;
}

const s = {
  progress: {
    width: '100px',
    margin: '10px 5px'
  }
};

function mapStateToProps (state) {
  const { isReady, isSyncing, latestBlock, startingBlock, highestBlock, network } = state.rpc;
  const { activePeers, connectedPeers, maxPeers } = state.rpc;

  return {
    isReady,
    isSyncing,
    latestBlock,
    startingBlock,
    highestBlock,
    network,
    peers: {
      active: activePeers,
      connected: connectedPeers,
      max: maxPeers
    }
  };
}

export default connect(
  mapStateToProps
)(StatusLine);
