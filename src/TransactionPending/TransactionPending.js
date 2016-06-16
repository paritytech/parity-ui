import React, { Component, PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';

import DescriptionIcon from 'material-ui/svg-icons/action/description';
import GasIcon from 'material-ui/svg-icons/maps/local-gas-station';
import TransactionMainDetails from '../TransactionMainDetails';
import TransactionPendingForm from '../TransactionPendingForm';
import styles from './TransactionPending.css';

import * as tUtil from '../util/transaction';

export default class TransactionPending extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    chain: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.object, // eth BigNumber, not required since it mght take time to fetch
    value: PropTypes.string.isRequired, // wei hex
    gasPrice: PropTypes.string.isRequired, // wei hex
    gas: PropTypes.string.isRequired, // hex
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.object, // eth BigNumber - undefined if it's a contract or until it's fetched
    data: PropTypes.string, // hex
    nonce: PropTypes.number,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  state = {
    isDataExpanded: false
  };

  componentWillMount () {
    const { gas, gasPrice, value } = this.props;
    const fee = tUtil.getFee(gas, gasPrice); // BigNumber object
    const totalValue = tUtil.getTotalValue(fee, value);
    const gasPriceSzaboDisplay = tUtil.getSzaboFromWeiDisplay(gasPrice); // szabo string
    const gasPriceEthDisplay = tUtil.getEthFromWeiDisplay(gasPrice);
    this.setState({ gasPriceSzaboDisplay, gasPriceEthDisplay, totalValue });
  }

  render () {
    const { totalValue } = this.state;
    const className = this.props.className || '';
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
          { this.renderData() }
        </div>
        <div className={ styles.expandedContainer }>
          { this.renderDataExpanded() }
        </div>
      </div>
    );
  }

  renderGasPrice () {
    const { id } = this.props;
    const { gasPriceSzaboDisplay, gasPriceEthDisplay } = this.state;
    return (
      <div
        data-tip
        data-place='right'
        data-for={ 'gasPrice' + id }
        data-effect='solid'
      >
        <span className={ styles.gasPrice }>
          <GasIcon />
          { gasPriceSzaboDisplay }
        </span>
        { /* dynamic id required in case there are multple transactions in page */ }
        <ReactTooltip id={ 'gasPrice' + id }>
          { gasPriceSzaboDisplay } [SZABO]: This is the maximum amount you would pay for each unit of gas required to process this transaction. <br />
          { gasPriceSzaboDisplay } [SZABO] equals { gasPriceEthDisplay } [ETH].
        </ReactTooltip>
      </div>
    );
  }

  renderData () {
    const { data, id } = this.props;
    const noDataClass = this.noData() ? styles.noData : '';
    return (
      <div
        className={ `${styles.data} ${noDataClass}` }
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
    this.setState({
      isDataExpanded: !this.state.isDataExpanded
    });
  }

  onConfirm = password => {
    const { id, gasPrice } = this.props;
    this.props.onConfirm(id, password, gasPrice);
  }

  onReject = () => {
    this.props.onReject(this.props.id);
  }

}
