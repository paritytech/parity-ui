import logger from '../utils/logger';
import { updateAppState } from '../actions/app';
import { isParityRunning } from '../utils/parity';

export default class appProvider {

  constructor (store, wsPath, ws) {
    this.wsPath = wsPath;
    this.store = store;
    this.ws = ws;
    this.ws.onOpen.push(::this.onWsOpen);
    this.ws.onError.push(::this.onWsError);
  }

  onWsOpen () {
    logger.log('[APP Provider] connected');
    this.store.dispatch(updateAppState({ isParityRunning: true, isLoading: false, isWsConnected: true }));
  }

  onWsError () {
    isParityRunning(this.wsPath)
      .then(isRunning => {
        this.store.dispatch(updateAppState({ isParityRunning: isRunning, isLoading: false, isWsConnected: false }));
      });
  }

}
