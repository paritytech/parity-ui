import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

import {Account} from '../Account/Account';
import {Web3Component} from '../Web3Component/Web3Component';

import styles from './styles.css';

export class TransactionConfirmation extends Web3Component {

  state = {
    unlocking: false,
    password: '',
    passwordError: false
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
      passwordError: false
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
    const { password, passwordError, unlocking } = this.state;

    if (unlocking) {
      return (
        <div className={styles.progress}>
          <LinearProgress mode='indeterminate' />
        </div>
      );
    }

    const error = password ? (passwordError ? 'Invalid password.' : null) : 'Type your password.';

    return (
      <TextField
        fullWidth
        hintText={`Password for ${from}`}
        errorText={error}
        floatingLabelText='Unlock the account'
        type='password'
        onChange={::this.onPasswordChange}
        onKeyDown={::this.onPasswordKeyDown}
      />
    );
  }

  renderValue (value) {
    const val = fromHex(value);
    return (
      <div>
        <strong style={{display: 'block'}}>{val.toFixed(2)}</strong>
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
    const from = this.props.transaction.params[0].from;
    const pass = this.state.password;

    this.setState({
      unlocking: true,
      passwordError: false
    });

    this.context.web3.personal.unlockAccount(from, pass, 1, (err, ok) => {
      if (err || !ok) {
        this.setState({
          unlocking: false,
          passwordError: true
        });
        return;
      }

      this.setState({
        unlocking: false,
        password: ''
      });
      this.props.onConfirm();
    });
  }

  renderDialogActions () {
    const { unlocking, password } = this.state;
    return [
      <FlatButton
        label='Abort'
        secondary
        disabled={unlocking}
        onTouchTap={this.props.onAbort}
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused={!!password.length}
        disabled={!password.length || unlocking}
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

function fromHex (val) {
  val = val.replace(/^0x/, '');
  return parseInt(val, 16);
}
