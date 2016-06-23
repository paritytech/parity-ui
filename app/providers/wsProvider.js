import isEqual from 'lodash.isequal';
import wsBase from '../utils/wsBase';
import logger from '../utils/logger';
import { updatePendingTransactions } from '../actions/transactions';
import { updateIsConnected } from '../actions/ws';
import { updateIsLoading } from '../actions/app';

export default class WsProvider extends wsBase {

  constructor (store, wsPath, addTokenListener) {
    super(wsPath);
    this.store = store;
    // todo [adgo] - move logic to react
    addTokenListener(::this.onTokenChange);
  }

  onTokenChange (token) {
    // token did not change
    if (token === false) {
      return;
    }
    this.init(token);
  }

  onWsOpen () {
    logger.log('[WS Provider] connected');
    super.onWsOpen();
    this.store.dispatch(updateIsConnected(true));
    this.store.dispatch(updateIsLoading(false));
    this.fetchPendingTransactions();
  }

  onWsError (err) {
    super.onWsError(err);
    this.store.dispatch(updateIsConnected(false));
    const { isLoading } = this.store.getState().app;

    // handle loading of app
    // todo [adgo] - find a better place to manage app loading state
    if (isLoading) {
      this.store.dispatch(updateIsLoading(false));
    }
  }

  onWsMsg (msg) {
    super.onWsMsg(msg);
    if (msg.data !== 'new_message') {
      return;
    }
    this.fetchPendingTransactions();
  }

  fetchPendingTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      const txsStored = this.store.getState().transactions.pending;
      if (isEqual(txsWs, txsStored)) {
        return;
      }

      logger.log('[WS Provider] transactions changed ', txsWs);
      this.store.dispatch(updatePendingTransactions(txsWs));
    });
  }

}
