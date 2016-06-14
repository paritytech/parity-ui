import React, { PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import HourGlassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// todo [adgo] - replace to Account without Web3
import AccountWeb3 from '../AccountWeb3';
import feeImgSrc from '../assets/pickaxe.png';
import Web3Component from '../Web3Component';
import styles from './Transaction.css';

export default class Transaction extends Web3Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    gasPrice: PropTypes.any,
    gas: PropTypes.any,
    to: PropTypes.string, // undefined if it's a contract
    nonce: PropTypes.number,
    value: PropTypes.string.isRequired, // hex of wei
    ethValue: PropTypes.number.isRequired,
    confirmTransaction: PropTypes.func.isRequired,
    rejectTransaction: PropTypes.func.isRequired
  };

  static defaultProps = {
    gasPrice: 20,
    // after user clicks 'reject' for the first time,
    // a second reject button is rendered and disabled
    // for a few seconds to avoid accidential double clicks
    rejectCounterTime: 3
  };

  componentWillMount () {
    // set estimated mining time, total value, and initial fee state
    this.modifyFee(this.props.gasPrice);
  }

  componentWillUnmount () {
    // in case reject counter is active
    this.resetReject();
  }

  state = {
    password: '',
    rejectCounter: this.props.rejectCounterTime
  };

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ `${styles.container} ${className || ''}` }>
        <div className={ styles.mainContainer }>
          { this.renderTransaction(from, to, value) }
          <div className={ styles.forms }>
            { this.renderConfirmForm() }
            { this.renderRejectForm() }
          </div>
        </div>
        <div className={ styles.bottomContainer }>
          { this.renderFee() }
          { this.renderEstimatedMinimgTime() }
          { this.renderData() }
          { this.renderDataExpanded() }
          { this.renderFeeCustomization() }
        </div>
      </div>
    );
  }

  renderTransaction (from, to, value) {
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <AccountWeb3 address={ from } />
        </div>
        <div className={ styles.tx }>
          { this.renderValue(value) }
          <div>&rArr;</div>
          { this.renderTotalValue() }
        </div>
        <div className={ styles.to }>
          <AccountWeb3 address={ to } />
        </div>
      </div>
    );
  }

  renderConfirmForm () {
    const { password, rejectOpen } = this.state;
    if (rejectOpen) {
      return;
    }

    return (
      <div className={ styles.confirmForm }>
        <TextField
          onChange={ this.modifyPassword }
          name='password'
          fullWidth
          floatingLabelText='password'
          type='password'
          value={ password }
        />
        <RaisedButton
          onClick={ this.confirm }
          className={ styles.confirmButton }
          fullWidth
          primary
          >
          Confirm Transaction
        </RaisedButton>
        <div className={ styles.reject }>
          <a onClick={ this.openReject }>Reject transaction</a>
        </div>
      </div>
    );
  }

  renderRejectForm () {
    const { rejectOpen, rejectCounter } = this.state;
    if (!rejectOpen) {
      return;
    }

    return (
      <div>
        <div className={ styles.rejectText }>
          Are you sure you want to reject transaction? <br />
          <strong>This cannot be undone</strong>
        </div>
        <RaisedButton
          onClick={ this.reject }
          className={ styles.rejectButton }
          disabled={ rejectCounter > 0 }
          fullWidth
          >
          Reject Transaction { this.renderRejectButtonCounter(rejectCounter) }
        </RaisedButton>
        <a className={ styles.closeRejectText } onClick={ this.resetReject }>
          I don't want to reject this transaction
        </a>
      </div>
    );
  }

  resetReject = () => {
    clearInterval(this.rejectInterval);
    this.setState({
      rejectCounter: this.props.rejectCounterTime,
      rejectOpen: false
    });
  }

  renderRejectButtonCounter (counter) {
    if (!counter) {
      return;
    }
    return (
      <span>{ `(${counter})` }</span>
    );
  }

  openReject = () => {
    this.setState({ rejectOpen: true });
    this.rejectInterval = setInterval(() => {
      let { rejectCounter } = this.state;
      if (rejectCounter === 0) {
        return clearInterval(this.rejectInterval);
      }
      this.setState({ rejectCounter: rejectCounter - 1 });
    }, 1000);
  }

  renderFee () {
    const { fee } = this.state;
    return (
      <div>
        <span
          className={ styles.fee }
          onClick={ this.toggleFeeCustomization }
          data-tip
          data-place='right'
          data-for='fee'
          data-effect='solid'
          >
          <img src={ feeImgSrc } />
          { fee }
        </span>
        <ReactTooltip id='fee'>
          { fee } [ETH]: This is the most amount of money that might be used to process this transaction. <br />
          You can increase it to lower mining time.
          <strong>click to edit</strong>
        </ReactTooltip>
      </div>
    );
  }

  renderEstimatedMinimgTime () {
    const { estimatedMiningTime } = this.state;
    return (
      <div>
        <span
          className={ styles.miningTime }
          data-tip
          data-place='right'
          data-for='miningTime'
          data-effect='solid'
          >
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
        data-tip
        data-place='right'
        data-for='data'
        data-effect='solid'
        >
        <a className={ styles.toggleData } onClick={ this.toggleDataExpanded }>
          <DescriptionIcon />
          { this.renderPreviewData() }
        </a>
        <ReactTooltip id='data'>
          Extra data to send along your transaction: { data || 'empty' }. <br />
          <strong>Click to expand</strong>.
        </ReactTooltip>
      </div>
    );
  }

  renderPreviewData () {
    const { data } = this.props;

    if (!data) {
      return 'empty';
    }

    return data.substr(0, 3) + '...';
  }

  toggleDataExpanded = () => {
    const { dataExpanded } = this.state;
    this.setState({ dataExpanded: !dataExpanded });
  }

  renderDataExpanded () {
    const { dataExpanded } = this.state;
    const { data } = this.props;
    if (!dataExpanded) {
      return;
    }

    return (
      <pre className={ styles.expandedData }>{ data || 'empty' }</pre>
    );
  }

  renderFeeCustomization () {
    const { fee } = this.state;

    if (!this.state.feeCustomizationOpen) {
      return;
    }

    // todo [adgo] - get real values
    const [min, max] = [0, 100];
    const marks = { [min]: 'Cheaper', [max]: 'Faster' };

    return (
      <div className={ styles.feeSlider }>
        <Slider
          onChange={ this.modifyFee }
          min={ min }
          max={ max }
          marks={ marks }
          value={ fee }
        />
        <a onClick={ this.closeFeeCustomization } />
      </div>
    );
  }

  toggleFeeCustomization = () => {
    const { feeCustomizationOpen } = this.state;
    this.setState({ feeCustomizationOpen: !feeCustomizationOpen });
  }

  modifyPassword = (evt) => {
    this.setState({ password: evt.target.value });
  }

  modifyFee = (fee) => {
    const totalValue = fee + this.props.value;
    const estimatedMiningTime = this.getEstimatedMiningTime(fee);
    this.setState({ fee, totalValue, estimatedMiningTime });
  }

  confirm = () => {
    const { password, fee } = this.state;
    this.props.confirmTransaction({
      id: this.props.id,
      password, fee
    });
  }

  reject = () => {
    this.props.rejectTransaction(this.props.id);
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

  getEstimatedMiningTime (fee) {
    // format this
    // this.props.getEstimatedMiningTime(fee);
    return '20s';
  }

}
