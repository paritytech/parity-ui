import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

import Account from '../Account';
import Web3Component from '../Web3Component';

import styles from './TransactionConfirmation.css';

export default class TransactionConfirmation extends Web3Component {

  state = {
    sending: false,
    password: '',
    error: false
  };

  componentWillReceiveProps () {
    this.setState({
      password: ''
    });
  }

  render () {
    const { open, transaction } = this.props;

    return (
      <Dialog
        title='Confirm Transaction'
        actions={this.renderDialogActions()}
        modal
        open={open}
        >
        {this.renderTransaction(transaction)}
      </Dialog>
    );
  }

  onPasswordChange (val) {
    this.setState({
      password: val.target.value,
      error: false
    });
  }

  renderTransaction (transaction) {
    if (!transaction) {
      return;
    }

    const { from, to, value } = transaction.params[0];

    return (
      <div>
        <div className={styles.confirmation}>
          <div className={styles.from}>
            <Account address={from} />
          </div>
          <div className={styles.tx}>
            <span>&rArr;</span>
            <br />
            {this.renderValue(value)}
          </div>
          <div className={styles.to}>
            <Account address={to} />
          </div>
        </div>
        {this.renderPassword(from)}
      </div>
    );
  }

  renderPassword (from) {
    const { password, error, sending } = this.state;

    if (sending) {
      return (
        <div className={styles.progress}>
          <LinearProgress mode='indeterminate' />
        </div>
      );
    }

    const errorMsg = password ? (error ? 'Invalid password or transaction.' : null) : 'Type your password.';

    return (
      <TextField
        fullWidth
        hintText={`Password for ${from}`}
        errorText={errorMsg}
        floatingLabelText='Unlock the account'
        type='password'
        onChange={::this.onPasswordChange}
        onKeyDown={::this.onPasswordKeyDown}
      />
    );
  }

  renderValue (value) {
    const val = this.context.web3.fromWei(value);
    return (
      <div>
        <strong style={{display: 'block'}}>{val}</strong>
        <span>Eth</span>
      </div>
    );
  }

  onPasswordKeyDown (ev) {
    if (ev.keyCode === 13) {
      this.confirm();
    }
  }

  confirm () {
    const txRequest = this.props.transaction.params[0];
    const pass = this.state.password;

    this.setState({
      sending: true,
      error: false
    });

    this.context.web3.personal.signAndSendTransaction(txRequest, pass, (err, txHash) => {
      // TODO [ToDr] 0x0 is a valid response. We should wait some time and then timeout.
      if (err || txHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        console.error(err);
        this.setState({
          sending: false,
          error: true
        });
        return;
      }

      this.setState({
        sending: false,
        password: ''
      });
      this.props.onConfirm(err, txHash);
    });
  }

  renderDialogActions () {
    const { sending, password } = this.state;
    return [
      <FlatButton
        label='Abort'
        secondary
        disabled={sending}
        onTouchTap={this.props.onAbort}
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused={!!password.length}
        disabled={!password.length || sending}
        onTouchTap={::this.confirm}
      />
    ];
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    transaction: React.PropTypes.object,
    onAbort: React.PropTypes.func.isRequired,
    onConfirm: React.PropTypes.func.isRequired
  };

}
