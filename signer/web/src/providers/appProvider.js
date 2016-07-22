import logger from '../utils/logger';
import { updateAppState } from '../actions/app';

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
    this.store.dispatch(
      updateAppState({ isParityRunning: true, isLoading: false, isWsConnected: true })
    );
  }

  onWsError () {
    this.store.dispatch(
      updateAppState({ isLoading: false, isWsConnected: false })
    );
  }

}
