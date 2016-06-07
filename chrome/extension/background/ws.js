/* global chrome */
import isEqual from 'lodash.isequal';
import Ws from '../../../util/ws';

const ws = new Ws();

// todo [adgo] - replace polling with initial one time fetching after parity supports WS push transactions
setInterval(fetchTransactions, 2000);

function fetchTransactions () {
  if (!ws.isConnected) {
    return console.log('[WS] not connected yet');
  }
  ws.send('personal_transactionsToConfirm', [], txsWs => {
    console.log('[WS] txs: ', txsWs);
    chrome.storage.local.get('transactions', obj => {
      // handle first time / reset of extension
      if (!obj.transactions) {
        return chrome.storage.local.set({ transactions: JSON.stringify(txsWs) });
      }
      try {
        const transactionsLs = JSON.parse(obj.transactions);
        console.log('[WS] chrome LS txs: ', transactionsLs);
        if (isEqual(txsWs, transactionsLs)) {
          return;
        }
        chrome.storage.local.set({ transactions: JSON.stringify(txsWs) });
      } catch (err) {
        console.error('[WS] bad data from extension local storage! object should contain transactions ', obj);
      }
    });
  });
}
