import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import { Web3Component } from '../Web3Component/Web3Component';

export default class AccountDetails extends Web3Component {

  state = {};

  render () {
    const { open } = this.props;

    return (
      <Dialog
        title='Create Account'
        actions={this.renderDialogActions()}
        open={open}
        autoScrollBodyContent
        onRequestClose={this.onClose}
        >
        {this.renderForm()}
      </Dialog>
    );
  }

  renderForm () {
    return (
      <div>
        <TextField
          fullWidth
          name={'new-account-password'}
          floatingLabelText='`DATA` - Password'
          value={this.state.password}
          onChange={this.modifyPassword}
        />
        <button
          onClick={this.submit}
          >
          submit!
        </button>
      </div>
    );
  }

  submit () {
    this.context.web3.personal.newAccount(this.state.password, (res) => {
      console.log(res);
    });
  }

  modifyPassword (evt) {
    this.setState({ password: evt.target.value });
  }

  renderDialogActions () {
    return [
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={this.onClose}
      />,
      <FlatButton
        label='OK'
        primary
        keyboardFocused
        onTouchTap={this.onClose}
      />
    ];
  }

  onClose = () => {
    this.props.onClose();
  }

  onClose = () => {
    this.props.onClose();
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired
  };

}
