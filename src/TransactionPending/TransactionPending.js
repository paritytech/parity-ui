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
    fromBalance: PropTypes.string, // wei hex
    value: PropTypes.string.isRequired, // wei hex
    gasPrice: PropTypes.string.isRequired, // wei hex
    gas: PropTypes.string.isRequired, // hex
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.string, // wei hex - undefined if it's a contract
    data: PropTypes.string, // hex
    nonce: PropTypes.number,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  componentWillMount () {
    // set estimated mining time, total value, and initial fee state
    this.onModifyGasPrice(this.props.gasPrice);
  }

  state = {
    totalValue: null, // string to be displayed along measuring unit i.e. 12.3 [ETH],
    fee: null, // string to be displayed along measuring unit i.e. 200,024 [WEI]
    isDataExpanded: false,
    isGasPriceExpanded: false,
    isMiningTimeExpanded: false
  };

  render () {
    const className = this.props.className || '';
    const { totalValue } = this.state;
    return (
      <div className={ `${styles.container} ${className}` }>
        <div className={ styles.mainContainer }>
          <TransactionMainDetails
            { ...this.props }
            totalValue={ totalValue }
            />
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
    const { id } = this.props;
    const { gasPriceDisplay, gasEthDisplay } = this.state;
    return (
      <div
        data-tip
        data-place='right'
        data-for={ 'gasPrice' + id }
        data-effect='solid'
      >
        <span
          className={ styles.gasPrice }
          onClick={ this.toggleGasPriceExpanded }
          >
          <GasIcon />
          { gasPriceDisplay }
        </span>
        { /* dynamic id required in case there are multple transactions in page */ }
        <ReactTooltip id={ 'gasPrice' + id }>
          { gasPriceDisplay } [SZABO]: This is the maximum amount you would pay for each unit of gas required to process this transaction. <br />
          { gasPriceDisplay } [SZABO] equals { gasEthDisplay } [ETH].
        </ReactTooltip>
      </div>
    );
  }

  renderData () {
    const { data, id } = this.props;
    const noDataClass = this.noData() ? styles.noData : '';
    return (
      <div
        className={ `${styles.data} ${noDataClass}`}
        onClick={ this.toggleDataExpanded }
        data-tip
        data-place='right'
        data-for={ 'data' + id }
        data-class={ styles.dataTooltip }
        data-effect='solid'
      >
        <DescriptionIcon />
        { tUtil.getShortData(data) }
        { /* dynamic id required in case there are multple transactions in page */ }
        <ReactTooltip id={ 'data' + id }>
          <strong>Extra data to send along your transaction: </strong>
          <br />
          { data }.
          <br />
          { this.noData() ? '' : <strong>Click to expand.</strong> }
        </ReactTooltip>
      </div>
    );
  }

  renderDataExpanded () {
    const { isDataExpanded } = this.state;
    const { data } = this.props;

    if (!isDataExpanded) {
      return;
    }

    return (
      <div className={ styles.expandedHelper }>
        <h3>Transaction's Data</h3>
        <code className={ styles.expandedData }>{ data }</code>
      </div>
    );
  }

  noData () {
    return this.props.data === '0x';
  }

  toggleDataExpanded = () => {
    if (this.noData()) {
      return;
    }
    const { isDataExpanded, isGasPriceExpanded } = this.state;
    const stateToSet = { isDataExpanded: !isDataExpanded };
    // close data in case it's it's expanded
    if (isGasPriceExpanded) {
      stateToSet.isGasPriceExpanded = false;
    }
    this.setState(stateToSet);
  }

  onConfirm = password => {
    const { gasPrice } = this.state;
    const { id } = this.props;
    this.props.onConfirm(id, password, gasPrice);
  }

  onReject = () => {
    this.props.onReject(this.props.id);
  }

  toggleGasPriceExpanded = () => {
    // const { isGasPriceExpanded, isDataExpanded } = this.state;
    // const stateToSet = { isGasPriceExpanded: !isGasPriceExpanded };
    // // close data in case it's it's expanded
    // if (isDataExpanded) {
    //   stateToSet.isDataExpanded = false;
    // }
    // this.setState(stateToSet);
  }

 renderEstimatedMinimgTime () {
    return null;

    // const { estimatedMiningTime } = this.state;
    // const { id } = this.props;
    // return (
    //   <div
    //     data-tip
    //     data-place='right'
    //     data-for={ 'miningTime' + id }
    //     data-effect='solid'
    //   >
    //     <span className={ styles.miningTime }>
    //       <HourGlassIcon />
    //       { estimatedMiningTime }
    //     </span>
    //     { #<{(| dynamic id required in case there are multple transactions in page |)}># }
    //     <ReactTooltip id={ 'miningTime' + id }>
    //       Your transaction will be mined probably <strong>within { estimatedMiningTime }</strong>. <br />
    //       Increase fee to make it faster.
    //     </ReactTooltip>
    //   </div>
    // );
  }

  onModifyGasPrice = gasPrice => {
    const gasPriceDisplay = tUtil.getGasPriceDisplay(gasPrice); // szabo string
    const gasEthDisplay = tUtil.getEthFromWeiDisplay(gasPrice)
    const fee = tUtil.getFee(this.props.gas, gasPrice); // BigNumber object
    const totalValue = tUtil.getTotalValue(fee, this.props.value); // BigNumber object
    const estimatedMiningTime = tUtil.getEstimatedMiningTime(gasPrice);
    this.setState({ gasPrice, gasPriceDisplay, fee, totalValue, estimatedMiningTime });
  }

  renderGasPriceExpanded () {
    return null;
    const { isGasPriceExpanded } = this.state;
    const { gasPrice } = this.props;

    if (!isGasPriceExpanded) {
      return;
    }

    // todo [adgo] - get real values
    const [min, max] = [gasPrice / 2, gasPrice * 1.5];
    const marks = { [min]: 'Cheaper', [max]: 'Faster' };

    return (
      <div className={ styles.gasPriceSlider }>
        <h3>Modify gas price</h3>
        <Slider
          onChange={ this.onModifyGasPrice }
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


}
