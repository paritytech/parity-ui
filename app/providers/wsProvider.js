import isEqual from 'lodash.isequal';
import wsBase from '../utils/wsBase';
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
    console.log('[WS Provider] connected');
    super.onWsOpen();
    this.store.dispatch(updateIsConnected(true));
    this.store.dispatch(updateIsLoading(false));
    this.pollTransactions();
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

  pollTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
      const txsStored = this.store.getState().transactions.pending;
      if (isEqual(txsWs, txsStored)) {
        return this.timeoutFetchTransactions();
      }

      console.log('[WS Provider] transactions changed ', txsWs);
      this.store.dispatch(updatePendingTransactions(txsWs));
      this.timeoutFetchTransactions();
    });
  }

  timeoutFetchTransactions = () => {
    setTimeout(::this.pollTransactions, 2000);
  }

}
