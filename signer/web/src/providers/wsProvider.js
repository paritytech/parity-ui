import { isEqual } from 'lodash';
import logger from '../utils/logger';
import { updatePendingRequests } from '../actions/transactions';

export default class WsProvider {

  constructor (store, wsPath, ws) {
    this.wsPath = wsPath;
    this.store = store;
    this.ws = ws;
    this.ws.onOpen.push(::this.onWsOpen);
    this.ws.onMsg.push(::this.onWsMsg);
  }

  onWsOpen () {
    this.fetchPendingRequests();
  }

  onWsMsg (msg) {
    if (msg.data !== 'new_message') {
      return;
    }
    this.fetchPendingRequests();
  }

  fetchPendingRequests () {
    this.send('personal_requestsToConfirm', [], (err, txsWs) => {
      if (err) {
        logger.warn('[WS Provider] error fetching pending requests', err);
        return;
      }

      const txsStored = this.store.getState().requests.pending;
      if (isEqual(txsWs, txsStored)) {
        return;
      }

      logger.log('[WS Provider] requests changed ', txsWs);
      this.store.dispatch(updatePendingRequests(txsWs));
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
