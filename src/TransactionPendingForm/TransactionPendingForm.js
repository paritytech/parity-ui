import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { REJECT_COUNTER_TIME } from '../constants/constants';

import styles from './TransactionPendingForm.css';

export default class TransactionPendingForm extends Component {

  static propTypes = {
    className: PropTypes.string,
    rejectCounterTime: PropTypes.number,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  };

  static defaultProps = {
    REJECT_COUNTER_TIME
  };

  state = {
    isRejectOpen: false,
    password: '',
    rejectCounter: this.props.rejectCounterTime
  };

  componentWillUnmount () {
    // in case reject counter is active
    this.onResetReject();
  }

  render () {
    const className = this.props.className || '';
    return (
      <div className={ `${styles.container} ${className}` }>
        { this.renderConfirmForm() }
        { this.renderRejectForm() }
      </div>
    );
  }

  renderConfirmForm () {
    const { password, isRejectOpen } = this.state;
    if (isRejectOpen) {
      return;
    }

    return (
      <div className={ styles.confirmForm }>
        <TextField
          onChange={ this.onModifyPassword }
          name='password'
          fullWidth
          floatingLabelText='password'
          type='password'
          value={ password }
        />
        <RaisedButton
          onClick={ this.onConfirm }
          className={ styles.confirmButton }
          fullWidth
          primary
          label='Confirm Transaction'
        />
        <div className={ styles.reject }>
          <a onClick={ this.onOpenReject }>Reject transaction</a>
        </div>
      </div>
    );
  }

  renderRejectForm () {
    const { isRejectOpen, rejectCounter } = this.state;
    if (!isRejectOpen) {
      return;
    }

    return (
      <div>
        <div className={ styles.rejectText }>
          Are you sure you want to reject transaction? <br />
          <strong>This cannot be undone</strong>
        </div>
        <RaisedButton
          onClick={ this.onReject }
          className={ styles.rejectButton }
          disabled={ rejectCounter > 0 }
          fullWidth
          >
          Reject Transaction { this.renderRejectButtonCounter(rejectCounter) }
        </RaisedButton>
        <a className={ styles.closeRejectText } onClick={ this.onResetReject }>
          I've changed my mind
        </a>
      </div>
    );
  }

  renderRejectButtonCounter (counter) {
    if (!counter) {
      return;
    }
    return (
      <span>{ `(${counter})` }</span>
    );
  }

  onConfirm = () => {
    const { password } = this.state;
    this.props.onConfirm(password);
  }

  onReject = () => {
    this.props.onReject();
  }

  onModifyPassword = (evt) => {
    this.setState({ password: evt.target.value });
  }

  onOpenReject = () => {
    this.setState({ rejectOpen: true });
    this.rejectInterval = setInterval(() => {
      let { rejectCounter } = this.state;
      if (rejectCounter === 0) {
        return clearInterval(this.rejectInterval);
      }
      this.setState({ rejectCounter: rejectCounter - 1 });
    }, 1000);
  }

  onResetReject = () => {
    clearInterval(this.rejectInterval);
    this.setState({
      rejectCounter: this.props.rejectCounterTime,
      rejectOpen: false
    });
  }

}
