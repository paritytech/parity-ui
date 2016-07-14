import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import { fixAccountNames } from '../../utils/accounts';
import { signerUrl } from '../../utils/signer';
import { fetchIsExtensionInstalled } from '../../utils/extension';
import Toasts from '../Toasts';
import TopBar from '../TopBar';
import TransactionConfirmation from '../TransactionConfirmation';
import Web3Component from '../Web3Component';
import Storage from '../Storage';

export default class Root extends Web3Component {

  // IE9 - contextTypes are not inherited
  static contextTypes = Web3Component.contextTypes;

  static propTypes = {
    interceptor: PropTypes.object.isRequired,
    options: PropTypes.shape({
      allAccounts: PropTypes.bool.isRequired
    }).isRequired
  }

  storage = Storage.crossOrigin();

  isChrome = !!window.chrome && !!window.chrome.webstore;

  toastId = 0;

  state = {
    isDomReady: false,
    isLoadingExtensionInstalled: true,
    isExtenstionInstalled: false,
    toasts: [],
    accounts: [],
    allAccounts: [],
    accountsNames: {},
    sendingTransaction: false,
    signerPort: 0, // assimilate signer disabled
    unsignedTransactionsCount: 0
  };

  listeners = [];

  componentWillMount () {
    // Because dom might not be ready yet we are deferring component load.
    // (We want to load component anyway for Interceptor logic to kick in)
    this.pollIsDomReady();
    this.updateIsExtensionInstalled();

    this.storageListener = this.storage.onAccountsNames(accountsNames => {
      if (isEqual(this.state.accountsNames, accountsNames)) {
        return;
      }

      this.setState({
        accountsNames: fixAccountNames(accountsNames, this.state.allAccounts)
      });
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
    clearTimeout(this.isExtensionInstalledTimeout);
  }

  render () {
    if (!this.state.isDomReady) {
      return this.renderTopBar();
    }
    return (
      <div>
        { this.renderTopBar() }
        { this.renderToasts() }
        { this.renderTransactionConfirmation() }
      </div>
    );
  }

  renderTopBar () {
    const { isLoadingExtensionInstalled, isExtenstionInstalled, accounts, allAccounts, accountsNames, signerPort, unsignedTransactionsCount, isDomReady } = this.state;
    return (
      <TopBar
        isDomReady={ isDomReady }
        isLoadingExtensionInstalled={ isLoadingExtensionInstalled }
        isExtenstionInstalled={ isExtenstionInstalled }
        accounts={ accounts }
        allAccounts={ allAccounts }
        accountsNames={ accountsNames }
        signerPort={ signerPort }
        unsignedTransactionsCount={ unsignedTransactionsCount }
        onChangeAccount={ this.onChangeAccount }
        onAccountsDetailsClose={ this.onAccountsDetailsClose }
      />
    );
  }

  renderTransactionConfirmation () {
    const { sendingTransaction, transaction } = this.state;
    return (
      <TransactionConfirmation
        open={ sendingTransaction }
        transaction={ transaction }
        onAbort={ this.abortTransaction }
        onConfirm={ this.confirmTransaction }
      />
    );
  } 

  renderToasts () {
    const { toasts } = this.state;
    return (
      <Toasts
        toasts={ toasts }
        onClickToast={ this.onClickToast }
        onRemoveToast={ this.onRemoveToast }
      />
    );
  }

  onTick (next) {
    this.context.web3.personal.signerEnabled((err, signerPort) => {
      if (err) {
        return;
      }

      this.setState({ signerPort });

      if (signerPort) {
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

      fixAccountNames(this.state.accountsNames, allAccounts);
      this.setState({ allAccounts });
      next();
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
    const { signerPort, isExtenstionInstalled } = this.state;
    if (signerPort) {
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

  onChangeAccount = account => {
    this.setState({
      accounts: [account]
    });
    // set default account
    this.context.web3.defaultAccount = account;
    this.context.web3.eth.defaultAccount = account;
    this.context.web3.settings.defaultAccount = account;
  }

  notifyNewTransaction () {
    const toast = {
      id: this.toastId,
      type: 'default',
      msg: 'New pending transaction'
    };
    this.toastId++;
    this.setState({
      toasts: [toast].concat(this.state.toasts)
    });
  }

  onClickToast = id => {
    this.openSigner();
    this.onRemoveToast(id);
  }

  onRemoveToast = id => {
    this.setState({
      toasts: this.state.toasts.filter(t => t.id !== id)
    });
  }

  openSigner () {
    const { signerPort } = this.state;
    const win = window.open(signerUrl(signerPort), '_blank');
    win.focus();
  }

  onAccountsDetailsClose = accountsNames => {
    this.setState({
      accountsNames
    });
    this.storage.setAccountsNames(accountsNames);
  }

  updateIsExtensionInstalled = () => {
    if (!this.isChrome || this.state.isExtenstionInstalled) {
      return;
    }
    fetchIsExtensionInstalled(isExtenstionInstalled => {
      if (!isExtenstionInstalled) {
        this.setState({
          isExtenstionInstalled: false,
          isLoadingExtensionInstalled: false
        });
        this.isExtensionInstalledTimeout = setTimeout(this.updateIsExtensionInstalled, 10000);
        return;
      }
      this.setState({
        isExtenstionInstalled: true,
        isLoadingExtensionInstalled: false
      });
    });
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


  pollIsDomReady = () => {
    if (!document.body) {
      setTimeout(this.pollIsDomReady, 5);
      return;
    }
    this.setState({
      isDomReady: true
    });
  }

}
