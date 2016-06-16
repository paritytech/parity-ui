import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import styles from './TransactionPendingFormConfirm.css';

export default class TransactionPendingFormConfirm extends Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired
  }

  state = {
    password: null
  }

  render () {
    const { password } = this.state;

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
          label='Confirm Transaction'
        />
      </div>
    );
  }

  onModifyPassword = evt => {
    this.setState({ password: evt.target.value });
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
}
