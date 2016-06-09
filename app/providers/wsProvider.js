import isEqual from 'lodash.isequal';
import wsBase from '../utils/wsBase';
import { updatePendingTransactions } from '../actions/transactions';
import { updateIsConnected } from '../actions/ws';

export default class WsProvider extends wsBase {

	constructor (store) {
		super();
		this.store = store;
    log('[Provider] init')
  }

  onWsOpen () {
    log('[Provider] open')
    super.onWsOpen();
    this.store.dispatch(updateIsConnected(true));
		this.pollTransactions();
	}

	pollTransactions () {
    this.send('personal_transactionsToConfirm', [], txsWs => {
    	const txsStored = this.store.getState().transactions.pending;
    	if (isEqual(txsWs, txsStored)) {
    		return this.timeoutFetchTransactions();
    	}

    	log('[WS Provider] transactions changed ', txsWs);
    	this.store.dispatch(updatePendingTransactions(txsWs));
      this.timeoutFetchTransactions();
    });
	}

  timeoutFetchTransactions = () => {
    setTimeout(::this.pollTransactions, 2000);
  }

}