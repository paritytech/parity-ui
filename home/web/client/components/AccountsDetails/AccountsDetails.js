import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import AddIcon from 'material-ui/svg-icons/content/add';

import Identicon from 'dapps-react-components/src/Identicon';

import resetStyles from '../../reset.css';
import styles from './AccountsDetails.css';

import { updateAccountsNames } from '../../actions/rpc';

export default class AccountsDetails extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    network: PropTypes.string.isRequired,
    accounts: PropTypes.array.isRequired,
    accountsNames: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpenCreateAccount: PropTypes.func.isRequired,
    updateAccountsNames: PropTypes.func.isRequired
  };

  state = {};

  componentWillReceiveProps (nextProps) {
    if (isEqual(this.props.accountsNames, nextProps.accountsNames)) {
      return;
    }
    this.copyToState(nextProps.accountsNames);
  }

  componentDidMount () {
    this.copyToState(this.props.accountsNames);
  }

  copyToState (accountsNames) {
    this.state = Object.assign({}, accountsNames);
  }

  render () {
    const { open } = this.props;

    return (
      <Dialog
        title='Accounts Details'
        actions={ this.renderDialogActions() }
        open={ open }
        className={ resetStyles.reset }
        autoScrollBodyContent
        onRequestClose={ this.onCancel }
        >
        <div className={ styles.accounts }>
          { this.renderAccounts() }
        </div>
      </Dialog>
    );
  }

  renderAccounts () {
    const { accounts, network } = this.props;
    if (!accounts.length) {
      return;
    }

    return accounts.map(acc => {
      const address = this.context.web3.toChecksumAddress(acc);
      const modify = this.changeName.bind(this, acc);
      return (
        <div key={ acc } className={ styles.acc }>
          <Identicon address={ acc } chain={ network } />
          <div className={ styles.inputs }>
            <TextField
              fullWidth
              name={ `name-${acc}` }
              floatingLabelText='Friendly name'
              value={ this.state[acc] || '' }
              onChange={ modify }
              />
            <TextField
              fullWidth
              style={ { height: '20px' } }
              underlineDisabledStyle={ { display: 'none' } }
              name={ `address-${acc}` }
              disabled
              value={ address }
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
        style={ { float: 'left' } }
        label={ <span className={ styles.newAccount }><AddIcon /> New Account</span> }
        primary
        onTouchTap={ this.onOpenCreateAccount }
      />,
      <FlatButton
        label='Cancel'
        secondary
        onTouchTap={ this.onCancel }
      />,
      <FlatButton
        label='OK'
        primary
        keyboardFocused
        onTouchTap={ this.onSubmit }
      />
    ];
  }

  onOpenCreateAccount = () => {
    this.props.onOpenCreateAccount();
  }

  onCancel = () => {
    this.copyToState(this.props.accountsNames);
    this.props.onClose();
  }

  onSubmit = () => {
    if (this.didNamesChange()) {
      this.props.updateAccountsNames(this.state);
    }
    this.props.onClose();
  }

  didNamesChange () {
    return !isEqual(this.state, this.props.accountsNames);
  }

}

function mapStateToProps (state) {
  const { network, accounts, accountsNames } = state.rpc;
  return { network, accounts, accountsNames };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateAccountsNames }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsDetails);
