import React from 'react';
import { isEqual } from 'lodash';

import AppsIcon from './logo.svg';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});

import { CHROME_EXT_ID } from '../../constants/constants';
import Toast from '../Toast';
import TransactionConfirmation from '../TransactionConfirmation';
import AccountChooser from '../AccountsChooser';
import Web3Component from '../Web3Component';
import AccountsDetails from '../AccountsDetails';
import SubdomainDialog from '../SubdomainDialog';
import CreateAccount from '../CreateAccount';
import StatusLine from '../StatusLine';
import DappNav from '../DappNav';
import ExtensionLink from '../ExtensionLink';
import Storage from '../Storage';
import { appLink } from '../appLink';

import styles from './TopBar.css';

export default class TopBar extends Web3Component {

  // IE9 - contextTypes are not inherited
  static contextTypes = Web3Component.contextTypes;

  static propTypes = {
    interceptor: React.PropTypes.object.isRequired,
    web3: React.PropTypes.object.isRequired,
    options: React.PropTypes.shape({
      allAccounts: React.PropTypes.bool.isRequired
    }).isRequired
  }

  storage = Storage.crossOrigin();

  isChrome = !!window.chrome && !!window.chrome.webstore;

  toastId = 0;

  state = {
    isLoadingExtensionInstalled: true,
    isExtenstionInstalled: false,
    toasts: [],
    waiting: 0,
    accounts: [],
    allAccounts: [],
    accountsNames: {},
    sendingTransaction: false,
    createAccountOpen: false,
    accountsDetails: false,
    isSignerEnabled: false,
    unsignedTransactionsCount: 0
  };

  listeners = [];

  componentWillMount () {
    this.updateIsExtensionInstalled();

    this.storageListener = this.storage.onAccountsNames(accountsNames => {
      if (isEqual(this.state.accountsNames, accountsNames)) {
        return;
      }

      this.fixAccountNames(accountsNames, this.state.allAccounts);
    });

    this.listeners = [
      this.props.interceptor.intercept('eth_accounts', this.onEthAccounts),
      this.props.interceptor.intercept('eth_sendTransaction', this.onEthSendTransaction)
    ];
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    this.storageListener();
    this.listeners.map(off => off());
    clearTimeout(this.isExtenstionInstalledTimeout);
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
      }, 5);
      return (
        <div className={ styles.topbar }>
            <h4 className={ styles.header }>Loading...</h4>
        </div>
      );
    }

    const { allAccounts, accountsNames, accountsDetails, createAccountOpen, isLoadingExtensionInstalled, isExtenstionInstalled } = this.state;

    return (
      <MuiThemeProvider muiTheme={ muiTheme }>
        <div>
          <div className={ styles.topbar }>
            <div className={ styles.header }>
              <a
                href={ appLink('home') }
                onClick={ this.forceNavigation }
                title='Home @ Parity'
                >
                <img src={ AppsIcon } className={ styles.dapps } />
              </a>
              <div className={ styles.dialog }>
                <SubdomainDialog>
                  <ReportProblem />
                </SubdomainDialog>
              </div>
              <DappNav onSearchActive={ this.onSearchActive }/>
              <div className={ this.state.searchActive ? styles.statusHidden : styles.statusVisible }>
                <StatusLine />
              </div>
              <div className={ styles.separator } />
              <div className={ styles.extension }>
                <ExtensionLink
                  isLoading={ isLoadingExtensionInstalled }
                  isInstalled={ isExtenstionInstalled }
                />
              </div>
            </div>
            { this.renderManageAccounts() }
          </div>
          { this.renderToasts() }
          <AccountsDetails
            open={ accountsDetails }
            accounts={ allAccounts }
            onOpenCreateAccount={ this.onOpenCreateAccount }
            accountsNames={ accountsNames }
            onClose={ this.onAccountsDetailsClose }
            />
          <CreateAccount
            open={ createAccountOpen }
            accounts={ allAccounts }
            onClose={ this.closeCreateAccount }
          />
          <TransactionConfirmation
            open={ this.state.sendingTransaction }
            transaction={ this.state.transaction }
            onAbort={ this.abortTransaction }
            onConfirm={ this.confirmTransaction }
          />
        </div>
      </MuiThemeProvider>
    );
  }

  renderUnconfirmedTransactions () {
    const { isSignerEnabled } = this.state;

    if (!isSignerEnabled) {
      return;
    }

    const { unsignedTransactionsCount } = this.state;

    if (!unsignedTransactionsCount) {
      return (
        <div className={ styles.signerCount }></div>
      );
    }

    const port = isSignerEnabled;
    return (
      <div className={ styles.signerCount }>
        <a
          target={ '_signer' }
          href={ `http://127.0.0.1:${port}/index.html` }
          title={ `There are ${unsignedTransactionsCount} transactions awaiting your confirmation.` }
        >
          <span>
            { unsignedTransactionsCount }
          </span>
        </a>
      </div>
    );
  }

  renderManageAccounts () {
    const { allAccounts, accountsNames } = this.state;

    if (!allAccounts.length) {
      return (
        <div className={ styles.link }>
          <a onClick={ this.onOpenCreateAccount }>
            Create Account
          </a>
        </div>
      );
    }

    return (
      <div className={ styles.nowrap }>
        <AccountChooser
          accounts={ allAccounts }
          accountsNames={ accountsNames }
          onChange={ this.changeAccount }
        />
        <a
          className={ styles.settings }
          href='javascript:void(0)'
          onClick={ this.onOpenAccountDetails }
          >
          <SettingsIcon />
        </a>
        { this.renderUnconfirmedTransactions() }
      </div>
    );
  }

  fixAccountNames (names, accounts) {
    const copy = Object.assign({}, names);
    const accountsNames = accounts.reduce((memo, acc, idx) => {
      memo[acc] = names[acc] || `Account ${idx + 1}`;
      return memo;
    }, copy);
    this.setState({ accountsNames });
  }

  onTick (next) {
    this.context.web3.personal.signerEnabled((err, isSignerEnabled) => {
      if (err) {
        return;
      }

      this.setState({ isSignerEnabled });

      if (isSignerEnabled) {
        this.context.web3.ethcore.unsignedTransactionsCount((err, unsignedTransactionsCount) => {
          if (err) {
            return;
          }

          if (this.state.unsignedTransactionsCount === unsignedTransactionsCount) {
            return;
          }

          this.setState({ unsignedTransactionsCount });
        });
      }
    });
    this.context.web3.eth.getAccounts((err, allAccounts) => {
      this.handleFirstRun(allAccounts);
      if (err) {
        next(10);
        return console.error(err);
      }

      if (isEqual(allAccounts, this.state.allAccounts)) {
        return next(10);
      }

      this.fixAccountNames(this.state.accountsNames, allAccounts);
      this.setState({ allAccounts });
      next();
    });
  }

  onSearchActive = active => {
    this.setState({
      searchActive: active
    });
  }

  onEthAccounts = (payload, cb, next) => {
    if (this.props.options.allAccounts) {
      return next();
    }

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

  onEthSendTransaction = (payload, cb, next) => {
    // Don't intercept sendTransaction if we are running with signer module.
    const { isSignerEnabled, isExtenstionInstalled } = this.state;
    if (isSignerEnabled) {
      if (!isExtenstionInstalled) {
        this.notifyNewTransaction();
      }
      return next();
    }

    if (!cb) {
      throw new Error('Synchronous sendTransaction is not supported.');
    }

    this.setState({
      sendingTransaction: true,
      transaction: payload,
      callbackFunc: this.toTransactionCb(payload.id, cb)
    });
  }

  clearTx = () => {
    this.setState({
      sendingTransaction: false,
      transaction: null,
      callbackFunc: null
    });
  }

  abortTransaction = () => {
    this.state.callbackFunc({ message: 'aborted' });
    this.clearTx();
  }

  confirmTransaction = (err, result) => {
    this.state.callbackFunc(err, result);
    this.clearTx();
  }

  toTransactionCb (id, cb) {
    return (err, result) => {
      cb(err, {
        jsonrpc: '2.0',
        id, result
      });
    };
  }

  changeAccount = account => {
    this.setState({
      accounts: [account]
    });
    // set default account
    this.props.web3.defaultAccount = account;
    this.props.web3.eth.defaultAccount = account;
    this.props.web3.settings.defaultAccount = account;
    this.context.web3.defaultAccount = account;
    this.context.web3.eth.defaultAccount = account;
    this.context.web3.settings.defaultAccount = account;
  }

  onOpenAccountDetails = () => {
    this.setState({
      accountsDetails: true
    });
  }

  onAccountsDetailsClose = names => {
    this.setState({
      accountsDetails: false,
      accountsNames: names
    });
    this.storage.setAccountsNames(names);
  }

  closeCreateAccount = () => {
    this.setState({ createAccountOpen: false });
  }

  onOpenCreateAccount = () => {
    this.setState({ createAccountOpen: true });
  }

  forceNavigation = () => {
    window.location.reload(true);
  }

  handleFirstRun = allAccounts => {
    this.handleFirstRun = () => {}; // change to noop after first tick
    this.storage.getNotFirstRun(notFirstRun => {
      if (notFirstRun) {
        return;
      }
      this.storage.saveNotFirstRun();
      if (allAccounts.length) {
        return;
      }
      this.onOpenCreateAccount();
    });
  }

  notifyNewTransaction () {
    const toast = {
      id: this.toastId,
      type: 'default',
      msg: 'New pending transaction' //
    };
    this.toastId++;
    this.setState({
      toasts: [toast].concat(this.state.toasts)
    });
  }

  renderToasts () {
    const { toasts } = this.state;
    if (!toasts.length) {
      return;
    }
    return (
      <div className={ styles.toasts }>
        {
          toasts.map(t => (
            <Toast
              key={ t.id }
              id={ t.id }
              msg={ t.msg }
              type={ t.type }
              onRemoveToast={ this.onRemoveToast }
              onClickToast={ this.onClickToast }
            />
          ))
        }
      </div>
    );
  }

  onClickToast = id => {
    this.openSigner();
    this.onRemoveToast(id);
  }

  openSigner () {
    const port = this.state.isSignerEnabled;
    const win = window.open(`http://127.0.0.1:${port}/index.html`, '_blank');
    win.focus();
  }

  onRemoveToast = id => {
    this.setState({
      toasts: this.state.toasts.filter(t => t.id !== id)
    });
  }

  updateIsExtensionInstalled = () => {
    if (!this.isChrome || this.state.isExtenstionInstalled) {
      return;
    }
    window.chrome.runtime.sendMessage(
      CHROME_EXT_ID,
      'version',
      reply => {
        if (!reply) {
          this.setState({ isExtenstionInstalled: false, isLoadingExtensionInstalled: false });
          this.isExtenstionInstalledTimeout = setTimeout(this.updateIsExtensionInstalled, 10000);
          return;
        }
        this.setState({ isExtenstionInstalled: true, isLoadingExtensionInstalled: false });
      }
    );
  }

}

