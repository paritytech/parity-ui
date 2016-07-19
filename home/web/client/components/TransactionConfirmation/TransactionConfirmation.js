import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isEqual } from 'lodash';
import ContractIcon from 'material-ui/svg-icons/action/code';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

import Account from '../Account';

import styles from './TransactionConfirmation.css';

import { startSignTransaction, rejectTransaction } from '../../actions/rpc';

class TransactionConfirmation extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    isSending: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    transaction: PropTypes.object.isRequired,
    chain: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  };

  componentWillReceiveProps (newProps) {
    if (isEqual(this.props, newProps)) {
      return;
    }

    this.setState({
      password: '',
      error: newProps.error
    });
  }

  state = {
    password: '',
    error: ''
  };

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
    const { open } = this.props;
    if (!open) {
      return;
    }
    const { from } = this.props.transaction.params[0];

    return (
      <div>
        <div className={ styles.confirmation }>
          <div className={ styles.from }>
            <Account address={ from } />
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
    const { to } = this.props.transaction.params[0];
    if (!to) {
      return (
        <div>
          <ContractIcon className={ styles.contractIcon } />
          <span className={ styles.contractText }>Contract</span>
        </div>
      );
    }

    return <Account address={ to } />;
  }

  renderPassword () {
    const { password, error } = this.state;
    const { isSending } = this.props;
    const { from } = this.props.transaction.params[0];

    if (isSending) {
      return (
        <div className={ styles.progress }>
          <LinearProgress mode='indeterminate' />
        </div>
      );
    }

    const errorMsg = error.length ? error : null;

    return (
      <TextField
        fullWidth
        hintText={ `Type password for ${from}` }
        errorText={ errorMsg }
        floatingLabelText='Password to unlock your account'
        type='password'
        value={ password }
        onChange={ this.onPasswordChange }
        onKeyDown={ this.onPasswordKeyDown }
      />
    );
  }

  renderValue () {
    let { value } = this.props.transaction.params[0];
    value = this.context.web3.fromWei(value);
    return (
      <div>
        <div><strong>{ value }</strong></div>
        <span>Eth</span>
      </div>
    );
  }

  renderDialogActions () {
    const { password } = this.state;
    const { isSending } = this.props;
    return [
      <FlatButton
        label='Reject'
        secondary
        disabled={ isSending }
        onTouchTap={ this.props.onReject }
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused={ !!password.length }
        disabled={ !password.length || isSending }
        onTouchTap={ this.onConfirm }
      />
    ];
  }

  onConfirm = () => {
    const txRequest = this.props.transaction.params[0];
    const { password } = this.state;
    this.props.onConfirm({ txRequest, password });
  }

  onPasswordKeyDown = evt => {
    if (evt.keyCode === 13) {
      this.onConfirm();
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
  const { open, isSending, error, transaction } = state.pendingTransaction;
  const chain = state.rpc.network;
  return {
    open, isSending, error, transaction, chain
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    onConfirm: startSignTransaction,
    onReject: rejectTransaction
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionConfirmation);
