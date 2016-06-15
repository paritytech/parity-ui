import React, { PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';

import HourGlassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import GasIcon from 'material-ui/svg-icons/maps/local-gas-station';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// todo [adgo] - replace to Account without Web3
import AccountWeb3 from '../AccountWeb3';
import Web3Component from '../Web3Component';
import styles from './TransactionPending.css';
import TransactionPendingForm from '../TransactionPendingForm';

import * as tUtil from '../util/transaction';

export default class TransactionPending extends Web3Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    gasPrice: PropTypes.number.isRequired, // Gwei
    gas: PropTypes.number.isRequired, // wei
    to: PropTypes.string, // undefined if it's a contract
    nonce: PropTypes.number,
    value: PropTypes.string.isRequired, // hex of wei
    ethValue: PropTypes.number.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  };

  componentWillMount () {
    // set estimated mining time, total value, and initial fee state
    this.modifyGasPrice(this.props.gasPrice);
  }

  state = {
    isDataExpanded: false,
    isGasPriceExpanded: false,
    isMiningTimeExpanded: false
  };

  render () {
    const className = this.props.className || '';
    return (
      <div className={ `${styles.container} ${className}` }>
        <div className={ styles.mainContainer }>
          { this.renderTransaction() }
          <TransactionPendingForm
            onConfirm={ this.onConfirm }
            onReject={ this.onReject }
          />
        </div>
        <div className={ styles.iconsContainer }>
          { this.renderGasPrice() }
          { this.renderEstimatedMinimgTime() }
          { this.renderData() }
        </div>
        <div className={ styles.expandedContainer }>
          { this.renderDataExpanded() }
          { this.renderMiningTimeExpanded() }
          { this.renderGasPriceExpanded() }
        </div>
      </div>
    );
  }

  renderTransaction () {
    const { from, to } = this.props;
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <AccountWeb3 address={ from } />
        </div>
        <div className={ styles.tx }>
          { this.renderValue() }
          <div>&rArr;</div>
          { this.renderTotalValue() }
        </div>
        <div className={ styles.to }>
          <AccountWeb3 address={ to } />
        </div>
      </div>
    );
  }

  renderValue () {
    const { ethValue } = this.props;
    return (
      <div>
        <div
          data-tip
          data-for='value'
          data-effect='solid'
          >
          <strong>{ ethValue } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id='value'>
          The value of the transaction
        </ReactTooltip>
      </div>
    );
  }

  renderTotalValue () {
    return (
      <div>
        <div
          data-tip
          data-for='totalValue'
          data-effect='solid'
          className={ styles.total }>
          { this.state.totalValue } ETH
        </div>
        <ReactTooltip id='totalValue'>
          The value of the transaction including the mining fee. <br />
          This is the maximum amount of ether that you will pay.
        </ReactTooltip>
      </div>
    );
  }

  renderGasPrice () {
    const { gasPrice } = this.state;
    return (
      <div
        data-tip
        data-place='right'
        data-for='gasPrice'
        data-effect='solid'
      >
        <span
          className={ styles.gasPrice }
          onClick={ this.toggleGasPriceExpanded }
          >
          <GasIcon />
          { gasPrice }
        </span>
        <ReactTooltip id='gasPrice'>
          { gasPrice } [Gwei]: This is the maximum amount of Gwei you will pay for each unit of gas required to process this transaction. <br />
          You can increase it to lower mining time.
          <strong> click to customize</strong>
        </ReactTooltip>
      </div>
    );
  }

  renderEstimatedMinimgTime () {
    const { estimatedMiningTime } = this.state;
    return (
      <div
        data-tip
        data-place='right'
        data-for='miningTime'
        data-effect='solid'
      >
        <span className={ styles.miningTime }>
          <HourGlassIcon />
          { estimatedMiningTime }
        </span>
        <ReactTooltip id='miningTime'>
          Your transaction will be mined probably <strong>within { estimatedMiningTime }</strong>. <br />
          Increase fee to make it faster.
        </ReactTooltip>
      </div>
    );
  }

  renderData () {
    const { data } = this.props;
    return (
      <div
        className={ styles.data }
        onClick={ this.toggleDataExpanded }
        data-tip
        data-place='right'
        data-for='data'
        data-effect='solid'
      >
        <DescriptionIcon />
        tUtil.getShortData(data);
        <ReactTooltip id='data'>
          Extra data to send along your transaction: { data || 'empty' }. <br />
          <strong>Click to expand</strong>.
        </ReactTooltip>
      </div>
    );
  }

  renderGasPriceExpanded () {
    const { gasPriceExpanded } = this.state;
    const { gasPrice } = this.props;

    if (!gasPriceExpanded) {
      return;
    }

    // todo [adgo] - get real values
    const [min, max] = [gasPrice / 2, gasPrice * 1.5];
    const marks = { [min]: 'Cheaper', [max]: 'Faster' };

    return (
      <div className={ styles.gasPriceSlider }>
        <h3>Modify gas price</h3>
        <Slider
          onChange={ this.modifyGasPrice }
          min={ min }
          max={ max }
          marks={ marks }
          value={ this.state.gasPrice }
        />
        <a onClick={ this.closeFeeCustomization } />
      </div>
    );
  }

  renderMiningTimeExpanded () {
    return null; // todo [adgo] - implement this
  }

  renderDataExpanded () {
    const { isDataExpanded } = this.state;
    const { data } = this.props;
    if (!isDataExpanded) {
      return;
    }

    return (
      <div className={ styles.expandedHelper }>
        <h3>Transcation's Data</h3>
        <pre className={ styles.expandedData }>{ data || 'empty' }</pre>
      </div>
    );
  }

  onConfirm = (password) => {
    const { gasPrice } = this.state;
    const { id } = this.props;
    this.props.onConfirm({ id, password, gasPrice });
  }

  onReject = () => {
    this.props.onReject(this.props.id);
  }

  modifyGasPrice = (gasPrice) => {
    const fee = tUtil.getFee(this.props.gas, gasPrice);
    const totalValue = tUtil.getTotalValue(fee, this.props.ethValue);
    const estimatedMiningTime = tUtil.getEstimatedMiningTime(gasPrice);
    this.setState({ gasPrice, fee, totalValue, estimatedMiningTime });
  }

  toggleGasPriceExpanded = () => {
    const { gasPriceExpanded } = this.state;
    this.setState({ gasPriceExpanded: !gasPriceExpanded });
  }

  toggleDataExpanded = () => {
    const { isDataExpanded } = this.state;
    this.setState({ isDataExpanded: !isDataExpanded });
  }

}
