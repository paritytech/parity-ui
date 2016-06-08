import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import AddIcon from 'material-ui/svg-icons/content/add';

import Web3Component from '../Web3Component';
import Identicon from '../Identicon';

import resetStyles from '../../reset.css';
import styles from './AccountsDetails.css';

export default class AccountDetails extends Web3Component {

  state = {};

  componentDidMount () {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps (newProps) {
    this.state = Object.assign({}, newProps.accountsNames);
  }

  render () {
    const { open, accounts } = this.props;

    return (
      <Dialog
        title='Accounts Details'
        actions={this.renderDialogActions()}
        open={open}
        className={resetStyles.reset}
        autoScrollBodyContent
        onRequestClose={::this.onCancel}
        >
        <div className={styles.accounts}>
          {this.renderAccounts(accounts)}
        </div>
      </Dialog>
    );
  }

  renderAccounts (accounts) {
    if (!accounts.length) {
      return;
    }

    return accounts.map((acc) => {
      const address = this.context.web3.toChecksumAddress(acc);
      const modify = this.changeName.bind(this, acc);
      return (
        <div key={acc} className={styles.acc}>
          <Identicon seed={acc} />
          <div className={styles.inputs}>
            <TextField
              fullWidth
              name={`name-${acc}`}
              floatingLabelText='Friendly name'
              value={this.state[acc] || ''}
              onChange={modify}
              />
            <TextField
              fullWidth
              style={{height: '20px'}}
              underlineDisabledStyle={{display: 'none'}}
              name={`address-${acc}`}
              disabled
              value={address}
              />
          </div>
        </div>
      );
    });
  }

  changeName (acc, ev) {
    this.setState({
      [acc]: ev.target.value
    });
  }

  renderDialogActions () {
    return [
      <FlatButton
        style={{ float: 'left' }}
        label={<span className={styles.newAccount}><AddIcon /> New Account</span>}
        primary
        onTouchTap={this.props.onOpenCreateAccount}
      />,
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={::this.onCancel}
      />,
      <FlatButton
        label='OK'
        primary
        keyboardFocused
        onTouchTap={::this.onClose}
      />
    ];
  }

  onCancel () {
    this.componentWillReceiveProps(this.props);
    this.props.onClose(this.state);
  }

  onClose () {
    this.props.onClose(this.state);
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    accounts: React.PropTypes.array.isRequired,
    onOpenCreateAccount: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
  };

}
