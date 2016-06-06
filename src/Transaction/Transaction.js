import React, { PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import HourGlassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AnimateChildren from '../components-compositors/Animated/children';
// todo [adgo] - replace to Account without Web3
import AccountWeb3 from '../AccountWeb3';
import Web3Component from '../Web3Component';
import styles from './Transaction.css';

export default class Transaction extends Web3Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    gasPrice: PropTypes.any,
    gas: PropTypes.any,
    to: PropTypes.string.isRequired,
    nonce: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
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
    // in reject counter is active
    this.resetReject();
  }

  state = {
    password: '',
    rejectCounter: this.props.rejectCounterTime
  };

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ className }>
        <div className={ styles.mainContainer }>
          { this.renderTransaction(from, to, value) }
          <AnimateChildren absolute>
            { this.renderConfirmForm() }
            { this.renderRejectForm() }
          </AnimateChildren>
        </div>
        <div className={ styles.bottomContainer }>
          { this.renderFeePrice() }
          { this.renderEstimatedMinimgTime() }
          { this.renderData() }
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
      <div className={ styles.form }>
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

  renderFeePrice () {
    const { fee } = this.state;
    return (
      <div>
        <span
          className={ styles.fee }
          onClick={ this.toggleFeeCustomization }
          data-tip
          data-for='fee'
          data-effect='solid'
          data-place='top'
          >
          { fee }
        </span>
        { this.renderFeeCustomization(fee) }
        <ReactTooltip id='fee'>
          { fee } [ETH]: This is the most amount of money that might be used to process this transaction. <br />
          You can increase it to lower mining time.
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
          data-place='top'
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
    return (
      <div>
        <DescriptionIcon />
        Data: { this.props.data || 'empty' }
      </div>
    );
  }

  renderFeeCustomization (fee) {
    if (!this.state.feeCustomizationOpen) {
      return;
    }

    // todo [adgo] - get real values
    const [min, max] = [0, 100];
    const marks = { [min]: 'Cheaper', [max]: 'Faster' };

    return (
      <div>
        <Slider
          className={ styles.feeSlider }
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

  renderValue (value) {
    return (
      <div>
        <strong>{ value } </strong>
        <small>ETH</small>
      </div>
    );
  }

  renderTotalValue () {
    return (
      <div className={ styles.total }>
        { this.state.totalValue } ETH
      </div>
    );
  }

  getEstimatedMiningTime (fee) {
    // format this
    // this.props.getEstimatedMiningTime(fee);
    return '20s';
  }

}
