import { addToast } from 'dapps-react-components/src/actions/toastr';

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
    const { isInstalled } = state.extension;
    // Don't intercept sendTransaction if we are running with signer module.
    if (signerPort) {
      next();
      if (!isInstalled) {
        this.notifyNewPendingTransaction();
      }
      return;
    }

    if (!cb) {
      throw new Error('Synchronous sendTransaction is not supported.');
    }

    // todo
    console.log('payload', payload);
    // this.setState({
    //   sendingTransaction: true,
    //   transaction: payload,
    //   callbackFunc: this.toTransactionCb(payload.id, cb)
    // });
  }

  onEthAccounts = (payload, cb, next) => {
    const { options, rpc } = this.store.getState();;
    if (options.allAccounts) {
      next();
      return;
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

  stop () {
    this.listeners.map(off => off());
  }

}
