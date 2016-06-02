import isEqual from 'lodash.isequal';
import Ws from '../../../util/ws';

const ws = new Ws();

// todo [adgo] - replace polling with initial one time fetching after parity supports WS push transactions
setInterval(fetchTransactions, 2000);

function fetchTransactions () {
  ws.send('personal_transactionsToConfirm', [], txsWs => {
    console.log('ws txs: ', txsWs);
    chrome.storage.local.get('transactions', (obj) => {
      const transactionsLs = JSON.parse(obj.transactions);
      console.log('chrome LS txs: ', transactionsLs);
      if (isEqual(txsWs, transactionsLs)) {
        return;
      }
      chrome.storage.local.set({ transactions: JSON.stringify(txsWs) });
    });
  });
}
