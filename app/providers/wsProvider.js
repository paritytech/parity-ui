import isEqual from 'lodash.isequal';
import wsBase from '../utils/wsBase';
import { updatePendingTransactions } from '../actions/transactions';
import { updateIsConnected, updateToken } from '../actions/ws';
import { updateIsLoading } from '../actions/app';

export default class WsProvider extends wsBase {

  constructor (store) {
    super();
    this.store = store;
  }

  init (token) {
    console.log('[WS Provider] init');
    this.store.dispatch(updateToken(token));
    super.init(token);
  }

  onWsOpen () {
    console.log('[WS Provider] open');
    super.onWsOpen();
    this.store.dispatch(updateIsConnected(true));
    this.store.dispatch(updateIsLoading(false));
    this.pollTransactions();
  }

  onWsError (err) {
    super.onWsError(err);
    this.store.dispatch(updateIsLoading(false));
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
