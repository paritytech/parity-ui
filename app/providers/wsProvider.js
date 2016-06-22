import isEqual from 'lodash.isequal';
import wsBase from '../utils/wsBase';
import logger from '../utils/logger';
import { updatePendingTransactions } from '../actions/transactions';
import { updateIsConnected } from '../actions/ws';
import { updateAppState } from '../actions/app';
import { isParityRunning } from '../utils/parity';

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
    this.store.dispatch(updateAppState({ isParityRunning: true, isLoading: false }));
    this.pollTransactions();
  }

  onWsError (err) {
    super.onWsError(err);
    this.store.dispatch(updateIsConnected(false));
    isParityRunning(this.wsPath)
      .then(isRunning => {
        this.store.dispatch(updateAppState({ isParityRunning: isRunning, isLoading: false }));
      });
  }

  pollTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      const txsStored = this.store.getState().transactions.pending;
      if (isEqual(txsWs, txsStored)) {
        return this.timeoutFetchTransactions();
      }

      logger.log('[WS Provider] transactions changed ', txsWs);
      this.store.dispatch(updatePendingTransactions(txsWs));
      this.timeoutFetchTransactions();
    });
  }

  timeoutFetchTransactions = () => {
    setTimeout(::this.pollTransactions, 2000);
  }

}
