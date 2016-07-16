import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ContractIcon from 'material-ui/svg-icons/action/code';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

import Account from 'dapps-react-components/src/Account';

import styles from './TransactionConfirmation.css';

import { confirmTransaction, rejectTransaction } from '../../actions/rpc';

class TransactionConfirmation extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    toBalance: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    chain: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  };

  state = {
    sending: false,
    password: '',
    error: ''
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({ error: nextProps.error });
    }
  }

  render () {
    const { open } = this.props;
    return (
      <Dialog
        title='Confirm Transaction'
        actions={ this.renderDialogActions() }
        modal
        open={ open }
        >
        { this.renderTransaction() }
      </Dialog>
    );
  }

  renderTransaction () {
    const { from, fromBalance, chain } = this.props;
    if (!from) {
      return;
    }

    return (
      <div>
        <div className={ styles.confirmation }>
          <div className={ styles.from }>
            <Account address={ from } balance={ fromBalance } chain={ chain } />
          </div>
          <div className={ styles.tx }>
            <span>&rArr;</span>
            <br />
            { this.renderValue() }
          </div>
          <div className={ styles.to }>
            { this.renderTo() }
          </div>
        </div>
        { this.renderPassword() }
      </div>
    );
  }

  renderTo () {
    const { to, toBalance, chain } = this.props;
    if (!to) {
      return (
        <div>
          <ContractIcon className={ styles.contractIcon } />
          <span className={ styles.contractText }>Contract</span>
        </div>
      );
    }

    return <Account address={ to } balance={ toBalance } chain={ chain } />;
  }

  renderPassword () {
    const { from } = this.props;
    const { password, error, sending } = this.state;

    if (sending) {
      return (
        <div className={ styles.progress }>
          <LinearProgress mode='indeterminate' />
        </div>
      );
    }

    const errorMsg = password ? (error.length ? 'Invalid password or transaction.' : null) : 'Type your password.';

    return (
      <TextField
        fullWidth
        hintText={ `Password for ${from}` }
        errorText={ errorMsg }
        floatingLabelText='Unlock the account'
        type='password'
        value={ this.state.password }
        onChange={ this.onPasswordChange }
        onKeyDown={ this.onPasswordKeyDown }
      />
    );
  }

  renderValue () {
    const { value } = this.props;
    return (
      <div>
        <div><strong>{ value }</strong></div>
        <span>Eth</span>
      </div>
    );
  }

  renderDialogActions () {
    const { sending, password } = this.state;
    return [
      <FlatButton
        label='Reject'
        secondary
        disabled={ sending }
        onTouchTap={ this.props.onReject }
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused={ !!password.length }
        disabled={ !password.length || sending }
        onTouchTap={ this.confirm }
      />
    ];
  }

  onConfirm () {
    this.setState({
      sending: true,
      error: ''
    });
    const pass = this.state.password;
    const { from, to, value, data } = this.props;
    this.props.onConfirm(pass, from, to, value, data);
  }

  onPasswordKeyDown = evt => {
    if (evt.keyCode === 13) {
      this.confirm();
    }
  }

  onPasswordChange = evt => {
    this.setState({
      password: evt.target.value,
      error: ''
    });
  }

}

function mapStateToProps (state) {
  const [fromBalance, toBalance] = ['0x', '0x']; // TODO get from state
  const { open, from, to, value, data, error } = state.pendingTransaction;
  const chain = state.rpc.network;
  return {
    open, from, fromBalance, to, toBalance, value, data, chain, error
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onConfirm: confirmTransaction,
    onReject: rejectTransaction
  });
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionConfirmation);
