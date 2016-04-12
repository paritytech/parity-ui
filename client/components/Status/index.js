
import React, { Component, PropTypes } from 'react';
import Box from '../Box';
import rlp from 'rlp';
import formatNumber from 'format-number';
import bytes from 'bytes';

export default class Status extends Component {

  renderNodeName () {
    const { status } = this.props;
    return (
      <span>
        {status.name || 'Node'}
      </span>
    );
  }

  renderSettings () {
    const {status, settings} = this.props;
    return (
      <div className='row'>
        <div className='col col-12'>
          <h1>{this.renderNodeName()} <strong>settings</strong></h1>
        </div>
        <div className='col col-6'>
          <h3>Chain</h3>
          <input type='text' readOnly value={settings.chain} />
          <h3>Peers</h3>
          <input type='text' readOnly value={`${status.peers}/${settings.maxPeers}`} />
          <h3>Network port</h3>
          <input type='text' readOnly value={settings.networkPort} />
        </div>
        <div className='col col-6'>
          <h3>RPC Enabled</h3>
          <input type='text' readOnly value={settings.rpcEnabled} />
          <h3>RPC Interface</h3>
          <input type='text' readOnly value={settings.rpcInterface} />
          <h3>RPC Port</h3>
          <input type='text' readOnly value={settings.rpcPort} />
        </div>
      </div>
    );
  }

  renderMiningDetails () {
    const {mining} = this.props;
    let isHex = str => str.match('[0-9A-F]+');
    const extraData = !isHex(mining.extraData) ? mining.extraData : rlp.decode(mining.extraData).toString().replace(/,/g, ' ');

    return (
      <div className='row clear'>
        <div className='col col-12'>
          <h1><span>Mining</span> settings</h1>
        </div>
        <div className='col col-6'>
          <h3>Author</h3>
          <input type='text' readOnly value={mining.author} />
          <h3>Extradata</h3>
          <input type='text' readOnly value={extraData} />
        </div>
        <div className='col col-6'>
          <h3>Minimal Gas Price</h3>
          <input type='text' readOnly value={mining.minGasPrice} />
          <h3>Gas floor target</h3>
          <input type='text' readOnly value={mining.gasFloorTarget} />
        </div>
      </div>
    );
  }

  render () {
    const {status} = this.props;
    const bestBlock = formatNumber()(status.bestBlock);
    const hashrate = bytes(status.bytes) || 0;

    return (
      <div className='dapp-flex-content'>
        <main className='dapp-content'>

          <div className='row clear'>
            <div className='col col-12'>
              <Box title='Best Block' value={bestBlock} />
              <Box title='Hash Rate' value={`${hashrate} H/s`} />
            </div>
          </div>

          {this.renderSettings()}
          {this.renderMiningDetails()}
          {/* this.renderAccounts()? */}
        </main>
      </div>
    );
  }
}

Status.propTypes = {
  mining: PropTypes.shape({
    author: PropTypes.string.isRequired,
    extraData: PropTypes.string.isRequired,
    minGasPrice: PropTypes.string.isRequired,
    gasFloorTarget: PropTypes.string.isRequired
  }).isRequired,
  settings: PropTypes.shape({
    chain: PropTypes.string.isRequired,
    networkPort: PropTypes.number.isRequired,
    maxPeers: PropTypes.number.isRequired,
    rpcEnabled: PropTypes.bool.isRequired,
    rpcInterface: PropTypes.string.isRequired,
    rpcPort: PropTypes.number.isRequired
  }).isRequired,
  status: PropTypes.shape({
    name: PropTypes.string,
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired
  }).isRequired
};
