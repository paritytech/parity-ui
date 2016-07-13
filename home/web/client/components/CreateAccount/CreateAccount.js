import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import { every } from 'lodash';

import validationsData from './validations.data';
import FormValidationDisplay from '../FormValidationDisplay';
import Identicon from 'dapps-react-components/src/Identicon';
import styles from './CreateAccount.css';
import Web3Component from '../Web3Component/Web3Component';

export default class CreateAccount extends Web3Component {
  // IE9 - contextTypes are not inherited
  static contextTypes = Web3Component.contextTypes;

  state = {
    createdAccount: false,
    password: '',
    validations: [],
    isValid: false
  };

  render () {
    const { open } = this.props;

    return (
      <Dialog
        title={ this.state.createdAccount ? 'Account Created' : 'New Account' }
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
    if (this.state.createdAccount) {
      return;
    }

    const { password, isValid } = this.state;
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
          onChange={ this.modifyPassword }
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
    const { createdAccount } = this.state;
    if (!createdAccount) {
      return;
    }

    return (
      <p className={ styles.newAccount }>
        New account address is: <br />
        <Identicon chain={ this.props.network } seed={ createdAccount } /><code>{ createdAccount }</code>
        <br />
        You can now choose it in the top right corner and expose it to dapps.
      </p>
    );
  }

  renderNoAccountsMsg () {
    if (this.props.accounts.length || this.state.createdAccount) {
      return;
    }

    return (
      <p className={ styles.noAccount }>
        You don't have any accounts created.<br />
        Enter a passphrase below to create one.
      </p>
    );
  }

  submit = () => {
    const createdAccount = this.context.web3.personal.newAccount(this.state.password);
    this.setState({ createdAccount });
  }

  modifyPassword = evt => {
    const password = evt.target.value;
    const validations = validationsData.map(v => v.predicate(password));
    const isValid = every(validations);
    this.setState({
      password, isValid, validations
    });
  }

  renderDialogActions () {
    if (this.state.createdAccount) {
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
        disabled={ !this.state.isValid }
        onTouchTap={ this.submit }
      />
    ];
  }

  onClose = () => {
    this.setState({
      password: '',
      isValid: false,
      createdAccount: false,
      validations: []
    });
    this.props.onClose();
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onClose: React.PropTypes.func.isRequired,
    network: React.PropTypes.string
  };

}
