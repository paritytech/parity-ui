import { addToast } from 'dapps-react-components/src/actions/toastr';
import { updatePendingTransaction } from '../actions/rpc';

export default class InterceptorProvider {

  constructor (store, interceptor) {
    this.store = store;
    this.interceptor = interceptor;
    this.listeners = [];
  }

  init () {
    const { intercept } = this.interceptor;
    this.listeners = [
      intercept('eth_accounts', this.onEthAccounts),
      intercept('eth_sendTransaction', this.onEthSendTransaction)
    ];
  }

  onEthSendTransaction = (payload, cb, next) => {
    const state = this.store.getState();
    const { signerPort } = state.rpc;
    const isInstalled = state.extension.version.length;
    // Don't intercept sendTransaction if we are running with signer module.
    if (signerPort) {
      if (!isInstalled) {
        this.notifyNewPendingTransaction();
      }
      return next();
    }

    if (!cb) {
      throw new Error('Synchronous sendTransaction is not supported.');
    }

    this.store.dispatch(
      updatePendingTransaction({
        transaction: payload,
        callback: this.toTransactionCb(payload.id, cb)
      })
    );
  }

  onEthAccounts = (payload, cb, next) => {
    const { options, rpc } = this.store.getState();
    if (options.allAccounts) {
      return next();
    }

    const response = {
      jsonrpc: payload.jsonrpc,
      id: payload.id,
      result: [rpc.activeAccount] // even tho a single account is returned, it's wrapped in array cuz thats what web3 expects
    };

    if (cb) {
      cb(null, response);
      return;
    }

    return response;
  }

  notifyNewPendingTransaction () {
    this.store.dispatch(
      addToast({
        type: 'default',
        msg: 'New pending transaction'
      })
    );
  }

  toTransactionCb (id, cb) {
    return (err, result) => {
      cb(err, {
        jsonrpc: '2.0',
        id, result
      });
    };
  }

}
