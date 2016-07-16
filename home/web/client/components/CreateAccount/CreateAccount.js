import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createAccount, resetCreateAccount } from '../../actions/rpc';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import { every } from 'lodash';

import validationsData from './validations.data';
import FormValidationDisplay from '../FormValidationDisplay';
import Identicon from 'dapps-react-components/src/Identicon';
import styles from './CreateAccount.css';

class CreateAccount extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    network: PropTypes.string.isRequired,
    noAccounts: PropTypes.bool.isRequired,
    createAccount: PropTypes.func.isRequired,
    createdAccount: PropTypes.string.isRequired,
    createdAccountError: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  };

  componentWillReceiveProps (nextProps) {
    if (
      this.props.createdAccount === nextProps.createdAccount ||
      nextProps.createdAccountError.length
    ) {
      return;
    }
    // todo [adgo] - handle better (probably in state)
    this.setState({
      isCreatingAccount: false
    });
  }

  state = {
    isCreatingAccount: false,
    password: '',
    validations: [],
    isValid: false
  };

  render () {
    const { open, createdAccount } = this.props;

    return (
      <Dialog
        title={ createdAccount.length ? 'Account Created' : 'New Account' }
        actions={ this.renderDialogActions() }
        open={ open }
        autoScrollBodyContent
        onRequestClose={ this.onClose }
        >
        { this.renderNoAccountsMsg() }
        { this.renderForm() }
        { this.renderCreatedAccount() }
      </Dialog>
    );
  }

  renderForm () {
    const { password, isValid } = this.state;
    const { createdAccount } = this.props;

    if (createdAccount.length) {
      return;
    }

    const errorText = !isValid && password ? ' ' : null;
    return (
      <div>
        <br />
        <p>Provide passphrase to protect your account. Make sure to note it down - it's not recoverable.</p>
        <TextField
          errorText={ errorText }
          fullWidth
          type='password'
          name={ 'new-account-password' }
          floatingLabelText='Type password to encrypt your private key'
          value={ password }
          onChange={ this.onModifyPassword }
        />
        { this.renderValidations() }
      </div>
    );
  }

  renderValidations () {
    return (
      <div>
        <br />
        { validationsData.map(
          (v, idx) => {
            return (
              <FormValidationDisplay
                text={ v.text }
                key={ idx }
                isValid={ this.state.validations[idx] || false }
              />
            );
          }
        ) }
      </div>
    );
  }

  renderCreatedAccount () {
    const { createdAccount, network } = this.props;
    if (!createdAccount.length) {
      return;
    }

    return (
      <p className={ styles.newAccount }>
        Account created: <br />
        <Identicon address={ createdAccount } chain={ network } />
        <code>{ createdAccount }</code>
      </p>
    );
  }

  renderNoAccountsMsg () {
    if (!this.props.noAccounts || this.props.createdAccount.length) {
      return;
    }

    return (
      <p className={ styles.noAccount }>
        You don't have any accounts created.<br />
        Enter a passphrase below to create one.
      </p>
    );
  }

  onModifyPassword = evt => {
    const password = evt.target.value;
    const validations = validationsData.map(v => v.predicate(password));
    const isValid = every(validations);
    this.setState({
      password, isValid, validations
    });
  }

  renderDialogActions () {
    if (this.props.createdAccount.length) {
      return (
        <FlatButton
          label='Ok'
          primary
          onTouchTap={ this.onClose }
        />
      );
    }
    return [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={ this.onClose }
      />,
      <RaisedButton
        label='Create'
        className={ styles.submit }
        primary
        disabled={ !this.state.isValid || this.state.isCreatingAccount }
        onTouchTap={ this.onSubmit }
      />
    ];
  }

  onSubmit = () => {
    this.setState({
      isCreatingAccount: true
    });
    this.props.createAccount(this.state.password);
  }

  onClose = () => {
    this.setState({
      password: '',
      isValid: false,
      validations: []
    });
    this.props.onClose();
    this.props.resetCreateAccount();
  }

}

function mapStateToProps (state) {
  return {
    network: state.rpc.network,
    noAccounts: !state.rpc.accounts.length,
    createdAccount: state.rpc.createdAccount,
    createdAccountError: state.rpc.createdAccountError
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ createAccount, resetCreateAccount }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
