import isEqual from 'lodash.isequal';
import logger from '../utils/logger';
import { updatePendingTransactions } from '../actions/transactions';
import { updateIsConnected } from '../actions/ws';
import { updateAppState } from '../actions/app';
import { isParityRunning } from '../utils/parity';

export default class WsProvider {

  constructor (store, wsPath, ws) {
    this.wsPath = wsPath;
    this.store = store;
    this.ws = ws;
    this.ws.onOpen.push(::this.onWsOpen);
    this.ws.onError.push(::this.onWsError);
    this.ws.onMsg.push(::this.onWsMsg);
  }

  onWsOpen () {
    logger.log('[WS Provider] connected');
    this.store.dispatch(updateIsConnected(true));
    this.store.dispatch(updateAppState({ isParityRunning: true, isLoading: false }));
    this.fetchPendingTransactions();
  }

  onWsError () {
    this.store.dispatch(updateIsConnected(false));
    isParityRunning(this.wsPath)
      .then(isRunning => {
        this.store.dispatch(updateAppState({ isParityRunning: isRunning, isLoading: false }));
      });
  }

  onWsMsg (msg) {
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

  send (method, params, callback) {
    const payload = {
      jsonrpc: '2.0',
      method, params
    };
    this.ws.send(payload, callback);
  }

}
