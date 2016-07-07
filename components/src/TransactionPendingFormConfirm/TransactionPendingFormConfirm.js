import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTooltip from 'react-tooltip';

import styles from './TransactionPendingFormConfirm.css';

export default class TransactionPendingFormConfirm extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired
  }

  id = Math.random(); // for tooltip

  state = {
    password: '',
    isValid: false
  }

  render () {
    const { password, isValid } = this.state;

    return (
      <div className={ styles.confirmForm }>
        <TextField
          onChange={ this.onModifyPassword }
          onKeyDown={ this.onKeyDown }
          name='password'
          fullWidth
          floatingLabelText='password'
          type='password'
          value={ password }
        />
        <div
          data-tip
          data-place='bottom'
          data-for={ 'transactionConfirmForm' + this.id }
          data-effect='solid'
        >
          <RaisedButton
            onClick={ this.onConfirm }
            className={ styles.confirmButton }
            fullWidth
            primary
            disabled={ !isValid }
            label='Confirm Transaction'
          />
        </div>
        { this.renderTooltip() }
      </div>
    );
  }

  renderTooltip () {
    if (this.state.isValid) {
      return;
    }
    return (
      <ReactTooltip id={ 'transactionConfirmForm' + this.id }>
        Please provide a password for this account
      </ReactTooltip>
    );
  }

  onModifyPassword = evt => {
    const password = evt.target.value;
    this.setState({
      password,
      isValid: this.validate(password)
    });
  }

  onConfirm = () => {
    const { password } = this.state;
    this.props.onConfirm(password);
  }

  onKeyDown = evt => {
    if (evt.which !== 13) {
      return;
    }

    this.onConfirm();
  }

  validate (password) {
    return password.length > 0;
  }
}
