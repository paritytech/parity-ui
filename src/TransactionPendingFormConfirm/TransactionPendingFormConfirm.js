import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import styles from './TransactionPendingFormConfirm.css';

export default class TransactionPendingFormConfirm extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired
  }

  state = {
    password: '',
    isValid: true // todo [adgo] - change to false after implementing this.validate
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
        <RaisedButton
          onClick={ this.onConfirm }
          className={ styles.confirmButton }
          fullWidth
          primary
          disabled={ !isValid }
          label='Confirm Transaction'
        />
      </div>
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

  // todo [adgo] - implement
  validate (password) {
    return true;
  }
}
