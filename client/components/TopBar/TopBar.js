import React from 'react';

import {TransactionConfirmation} from '../TransactionConfirmation/TransactionConfirmation';
import {AccountChooser} from '../AccountsChooser/AccountsChooser';

import styles from './styles.css';

export default class extends React.Component {

  state = {
    accounts: [],
    allAccounts: [],
    sendingTransaction: false
  };

  listeners = [];

  constructor (...args) {
    super(...args);
  }

  componentWillMount () {
    this.listeners = [
      this.props.interceptor.intercept('eth_accounts', ::this.onEthAccounts),
      this.props.interceptor.intercept('eth_sendTransaction', ::this.onEthSendTransaction),
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
  }

  onAllAccounts (accounts) {
    this.setState({
      allAccounts: accounts
    });
  }

  render () {
    return (
      <div>
        <div className={styles.topbar}>
          <h4 className={styles.header}>Identity @ Parity</h4>
          <AccountChooser
            onChange={::this.changeAccount}
            onAllAccounts={::this.onAllAccounts}
            />
        </div>
        <TransactionConfirmation
          open={this.state.sendingTransaction}
          transaction={this.state.transaction}
          onAbort={::this.abortTransaction}
          onConfirm={::this.confirmTransaction}
          />
      </div>
    );
  }

  static propTypes = {
    interceptor: React.PropTypes.object.isRequired
  };
}
