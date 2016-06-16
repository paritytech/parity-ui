import React, { Component, PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';

import HourGlassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import GasIcon from 'material-ui/svg-icons/maps/local-gas-station';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import TransactionMainDetails from '../TransactionMainDetails';
import styles from './TransactionPending.css';
import TransactionPendingForm from '../TransactionPendingForm';

import * as tUtil from '../util/transaction';

export default class TransactionPending extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.number.isRequired, // eth
    value: PropTypes.string.isRequired, // hex of wei
    ethValue: PropTypes.number.isRequired,
    gasPrice: PropTypes.number.isRequired, // Gwei
    gas: PropTypes.number.isRequired, // wei
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.number, // eth - undefined if it's a contract
    nonce: PropTypes.number,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    className: PropTypes.string
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
          <TransactionMainDetails { ...this.props } />
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
