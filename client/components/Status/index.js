
import React, { Component, PropTypes } from 'react';
import formatNumber from 'format-number';
import bytes from 'bytes';

import style from './style.css';
import EditableValue from '../EditableValue';
import Value from '../Value';

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
      <div className='col col-4 tablet-col-1-2 mobile-full' {...this._test('container')}>
        <h1><span>Network</span> settings</h1>
        <h3>Chain</h3>
        <Value value={settings.chain} />
        <div className={style.row}>
          <div className='col col-6 mobile-full'>
            <h3>Peers</h3>
            <Value value={`${status.peers}/${settings.maxPeers}`} />
          </div>
          <div className='col col-6 mobile-full'>
            <h3>Network port</h3>
            <Value value={settings.networkPort} />
          </div>
        </div>

        <h3>RPC Enabled</h3>
        <Value value={settings.rpcEnabled ? 'yes' : 'no'} />
        <div className={style.row}>
          <div className='col col-6 mobile-full'>
            <h3>RPC Interface</h3>
            <Value value={settings.rpcInterface} />
          </div>
          <div className='col col-6 mobile-full'>
            <h3>RPC Port</h3>
            <Value value={settings.rpcPort} />
          </div>
        </div>
      </div>
    );
  }

  renderMiningDetails () {
    const {mining} = this.props;

    let onMinGasPriceChange = (newVal) => {
      this.props.actions.modifyMinGasPrice(+newVal);
    };

    let onExtraDataChange = (newVal) => {
      this.props.actions.modifyExtraData(newVal);
    };

    let onAuthorChange = (newVal) => {
      this.props.actions.modifyAuthor(newVal);
    };

    let onGasFloorTargetChange = (newVal) => {
      this.props.actions.modifyGasFloorTarget(+newVal);
    };

    return (
      <div className='col col-4 tablet-col-1-2 mobile-full'>
        <h1><span>Mining</span> settings</h1>
        <h3>Author</h3>
        <EditableValue
          {...this._test('author')}
          value={mining.author}
          onSubmit={onAuthorChange}/>
        <h3>Extradata</h3>
        <EditableValue
          {...this._test('extra-data')}
          value={mining.extraData}
          onSubmit={onExtraDataChange}>
          <a className={style.inputTrigger} onClick={this.props.actions.resetExtraData} title='Reset Extra Data'>
            <i className='icon-anchor'></i>
          </a>
        </EditableValue>
        <h3>Minimal Gas Price</h3>
        <EditableValue
          value={mining.minGasPrice}
          onSubmit={onMinGasPriceChange}/>
        <h3>Gas floor target</h3>
        <EditableValue
          value={mining.gasFloorTarget}
          onSubmit={onGasFloorTargetChange}/>
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
          <div className='dapp-container'>
            <div className='row clear'>
              <div className='col col-4 tablet-full mobile-full'>
                <div className='col col-12 tablet-col-1-2 mobile-full'>
                  <h1><span>Best</span> Block</h1>
                  <h1>#{bestBlock}</h1>
                </div>
                <div className='col col-12 tablet-col-1-2 mobile-full'>
                  <h1><span>Hash</span> Rate</h1>
                  <h1>{`${hashrate} H/s`}</h1>
                </div>
              </div>
              {this.renderMiningDetails()}
              {this.renderSettings()}
            </div>
          </div>
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
