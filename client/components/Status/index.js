
import React, { Component, PropTypes } from 'react';
import formatNumber from 'format-number';
import bytes from 'bytes';

import style from './style.css';
import Box from '../Box';
import EditableInput from '../EditableInput';

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

    const onMinGasPriceChange = (evt) => {
      this.props.actions.modifyMinGasPrice(+evt.target.value);
    };

    const onExtraDataChange = (evt) => {
      this.props.actions.modifyExtraData(evt.target.value);
    };

    const onAuthorChange = (evt) => {
      this.props.actions.modifyAuthor(evt.target.value);
    };

    const onGasFloorTargetChange = (evt) => {
      this.props.actions.modifyGasFloorTarget(+evt.target.value);
    };

    return (
      <div className='row clear'>
        <div className='col col-12'>
          <h1><span>Mining</span> settings</h1>
        </div>
        <div className='col col-6'>
          <h3>Author</h3>
          <EditableInput
            value={mining.author}
            onSubmit={onAuthorChange}/>
          <h3>Extradata</h3>
          <div>
            <EditableInput
              value={mining.extraData}
              onSubmit={onExtraDataChange}>
              {this.renderResetData()}
            </EditableInput>
          </div>
        </div>
        <div className='col col-6'>
          <h3>Minimal Gas Price</h3>
          <EditableInput
            value={mining.minGasPrice}
            onSubmit={onMinGasPriceChange}/>
          <h3>Gas floor target</h3>
          <EditableInput
            value={mining.gasFloorTarget}
            onSubmit={onGasFloorTargetChange}/>
        </div>
      </div>
    );
  }

  renderResetData () {
    const {mining} = this.props;

    const defaultExtraData = this.getDefaultExtraData();

    if (mining.extraData === defaultExtraData) {
      return;
    }

    return (
      <a
        className={style.inputTrigger}
        onClick={::this.onResetExtraData}
        title={`Reset to ${defaultExtraData}`}
        >
        <i className='icon-anchor'></i>
      </a>
    );
  }

  onResetExtraData () {
    this.props.actions.modifyExtraData(this.getDefaultExtraData());
  }

  getDefaultExtraData () {
    return this.props.status.version.split('/').slice(0, 3).join('/');
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

          {this.renderMiningDetails()}
          {this.renderSettings()}
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
    version: PropTypes.string.isRequired,
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    modifyMinGasPrice: PropTypes.func.isRequired,
    modifyAuthor: PropTypes.func.isRequired,
    modifyGasFloorTarget: PropTypes.func.isRequired,
    modifyExtraData: PropTypes.func.isRequired,
    resetExtraData: PropTypes.func.isRequired
  }).isRequired
};
