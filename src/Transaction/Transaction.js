import React, { PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import HourGlassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
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
  }

  state = {
    gasPrice: this.props.gasPrice || 20,
    estimatedMiningTime: this.getEstimatedMiningTime(this.props.gasPrice || 20),
    password: ''
  };

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ `${styles.container} ${className}` }>
        { this.renderTransaction(from, to, value) }
        { this.renderInputs() }
        { this.renderTotal() }
        { this.renderActions() }
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
          <span>&rArr;</span>
          <br />
          { this.renderValue(value) }
        </div>
        <div className={ styles.to }>
          <AccountWeb3 address={ to } />
        </div>
      </div>
    );
  }

  renderInputs () {
    const { password, gasPrice, estimatedMiningTime } = this.state;
    return (
      <div className={ styles.inputs }>
        <TextField
          onChange={ this.modifyPassword }
          name='password'
          fullWidth
          floatingLabelText='password'
          type='password'
          value={ password }
        />
        <div>
          <span
            data-tip
            data-for='miningTime'
            >
            Gas price [ETH]
          </span>
          <span className={ styles.miningTime }>
            <HourGlassIcon data-tip data-for='miningTime' />
            { estimatedMiningTime }
          </span>
          <ReactTooltip id='miningTime'>
            Your transaction will be mind probably <strong>within { estimatedMiningTime }</strong>.
          </ReactTooltip>
          <Slider
            onChange={ this.modifyGasPrice }
            max={ 100 }
            marks={ { 0: 'Cheaper',
            50: gasPrice,
             100: 'Faster' } }
            value={ gasPrice }
          />
        </div>
      </div>
    );
  }

  renderActions () {
    return (
      <div className={ styles.actions }>
        <RaisedButton
          onClick={ this.reject }
          className={ styles.action }
          secondary
        >
          Confirm
        </RaisedButton>
        <RaisedButton
          onClick={ this.confirm }
          className={ styles.action }
          primary
        >
          Reject
        </RaisedButton>
      </div>
    );
  }

  renderTotal () {
    const { value } = this.props;
    const { gasPrice } = this.state;
    return (
      <div className={ styles.total }>
        Transaction amount: { value } <br />
        Gas price: { gasPrice } <br />
        Total amount: <strong>{ value + gasPrice }</strong>
      </div>
    );
  }

  modifyPassword = (evt) => {
    this.setState({ password: evt.target.value });
  }

  modifyGasPrice = (gasPrice) => {
    this.setState({ gasPrice });
  }

  confirm = () => {
    const { password, gasPrice } = this.state;
    this.props.confirmTransaction({
      id: this.props.id,
      password, gasPrice
    });
  }

  reject = () => {
    this.props.rejectTransaction(this.props.id);
  }

  renderValue (value) {
    value = this.context.web3.fromWei(value);
    return (
      <div>
        <strong style={ { display: 'block' } }>{ value }</strong>
        <span>Eth</span>
      </div>
    );
  }

  getEstimatedMiningTime () {
    return '20s';
  }

}
