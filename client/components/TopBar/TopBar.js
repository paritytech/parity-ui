import React from 'react';

import AppsIcon from 'material-ui/svg-icons/navigation/apps';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});

import {TransactionConfirmation} from '../TransactionConfirmation/TransactionConfirmation';
import {AccountChooser} from '../AccountsChooser/AccountsChooser';
import AccountsDetails from '../AccountsDetails';

import Storage from '../Storage';

import styles from './styles.css';

export default class TopBar extends React.Component {

  storage = new Storage();

  state = {
    waiting: 0,
    accounts: [],
    allAccounts: [],
    accountsNames: this.storage.getAccountsNames(),
    sendingTransaction: false,
    accountsDetails: false
  };

  listeners = [];

  constructor (...args) {
    super(...args);
  }

  componentWillMount () {
    this.listeners = [
      this.props.interceptor.intercept('eth_accounts', ::this.onEthAccounts),
      this.props.interceptor.intercept('eth_sendTransaction', ::this.onEthSendTransaction)
    ];
  }

  componentWillUnmount () {
    this.listeners.map((off) => off());
  }

  onEthAccounts (payload, cb, next) {
    const response = {
      jsonrpc: payload.jsonrpc,
      id: payload.id,
      result: this.state.accounts
    };

    if (cb) {
      return cb(null, response);
    }

    return response;
  }

  onEthSendTransaction (payload, cb, next) {
    if (!cb) {
      throw new Error('Synchronous sendTransaction is not supported.');
    }

    this.setState({
      sendingTransaction: true,
      transaction: payload,
      callbackFunc: cb,
      sendTxFunc: next
    });
  }

  clearTx () {
    this.setState({
      sendingTransaction: false,
      transaction: null,
      callbackFunc: null,
      sendTxFunc: null
    });
  }

  abortTransaction () {
    this.state.callbackFunc('aborted');
    this.clearTx();
  }

  confirmTransaction () {
    this.state.sendTxFunc(() => {
      this.clearTx();
    });
  }

  changeAccount (account) {
    this.setState({
      accounts: [account]
    });
    // set default account
    this.props.web3.defaultAccount = account;
  }

  onAllAccounts (accounts) {
    this.setState({
      allAccounts: accounts
    });
  }

  onOpenAccountDetails () {
    this.setState({
      accountsDetails: true
    });
  }

  onAccountsDetailsClose (names) {
    this.setState({
      accountsDetails: false,
      accountsNames: names
    });
    this.storage.setAccountsNames(names);
  }

  render () {
    // Because dom might not be ready yet
    // we are deferring component load.
    // (We want to load component anyway for
    //  Interceptor logic to kick in)
    if (!document.body) {
      setTimeout(() => {
        this.setState({
          waiting: this.state.waiting + 1
        });
      }, 10);
      return (
        <div className={styles.topbar}>
            <h4 className={styles.header}>Loading...</h4>
        </div>
      );
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div className={styles.topbar}>
            <div className={styles.header}>
              <a href='//home.parity' title='Home @ Parity'>
                <AppsIcon />
              </a>
            </div>
            <AccountChooser
              accountsNames={this.state.accountsNames}
              onChange={::this.changeAccount}
              onAllAccounts={::this.onAllAccounts}
              onOpenDetails={::this.onOpenAccountDetails}
              />
          </div>
          <AccountsDetails
            open={this.state.accountsDetails}
            accounts={this.state.allAccounts}
            accountsNames={this.state.accountsNames}
            onClose={::this.onAccountsDetailsClose}
            />
          <TransactionConfirmation
            open={this.state.sendingTransaction}
            transaction={this.state.transaction}
            onAbort={::this.abortTransaction}
            onConfirm={::this.confirmTransaction}
            />
        </div>
      </MuiThemeProvider>
    );
  }

  static propTypes = {
    interceptor: React.PropTypes.object.isRequired,
    web3: React.PropTypes.object.isRequired
  };
}
