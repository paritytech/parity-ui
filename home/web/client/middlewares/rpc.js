import logger from 'dapps-react-components/src/util/logger';
import * as actions from '../actions/rpc';

export default class RpcMiddleware {

  constructor (web3) {
    this.web3 = web3;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'update accounts') {
        this.onUpdateAccounts(store, action.payload);
        next(action);
        return;
      }

      if (action.type === 'create account') {
        this.onCreateAccount(store, action.payload);
        next(action);
        return;
      }

      if (action.type === 'start signTransaction') {
        const { txRequest, password } = action.payload;
        this.onStartSignTransaction(store, txRequest, password);
        next(action);
        return;
      }

      if (action.type === 'success signTransaction') {
        this.onSuccessSignTransaction(store, action.payload);
        next(action);
        return;
      }

      if (action.type === 'reject transaction') {
        this.onRejectTransaction(store);
        next(action);
        return;
      }

      next(action);
    };
  }

  // if there are no accounts, set first account as active
  // this logic will be replaced by a dedicated identity
  // management mechanism in the future
  onUpdateAccounts (store, nextAccounts) {
    const { accounts } = store.getState().rpc;
    if (!nextAccounts.length || accounts.length) {
      return;
    }
    store.dispatch(actions.updateActiveAccount(nextAccounts[0]));
  }

  onCreateAccount (store, password) {
    this.web3.personal.newAccount(password, (err, address) => {
      if (err) {
        store.dispatch(actions.errorCreatedAccount('error creating account ' + err.message));
        return;
      }
      store.dispatch(actions.updateCreatedAccount(address));
    });
  }

  onStartSignTransaction (store, txRequest, password) {
    this.web3.personal.signAndSendTransaction(txRequest, password, (err, txHash) => {
      // TODO [ToDr] 0x0 is a valid response. We should wait some time and then timeout.
      if (err || txHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        logger.warn('[MIDDLEWARE RPC] err signing transaction', txRequest);
        store.dispatch(actions.errorSignTransaction('Invalid password or transaction.'));
        return;
      }

      store.dispatch(actions.successSignTransaction(txHash));
    });
  }

  onSuccessSignTransaction (store, txHash) {
    const { callback } = store.getState().pendingTransaction;
    callback(null, txHash);
  }

  onRejectTransaction (store) {
    const { callback } = store.getState().pendingTransaction;
    callback({ message: 'aborted' });
  }

}
