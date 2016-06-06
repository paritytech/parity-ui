/* global chrome */

// init
chrome.storage.local.get('transactions', (obj) => {
  let { transactions } = obj;

  if (transactions) {
    transactions = JSON.parse(transactions);
    console.log('badge init transcations: ', transactions);
    chrome.browserAction.setBadgeText({ text: transactions.length.toString() });
  } else {
    // Initial
    console.log('badge init transcations: ', 'none');
    chrome.browserAction.setBadgeText({ text: '' });
  }
});

// sync with changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && 'transactions' in changes) {
    const { transactions } = changes;
    console.log('LS: transactions changed!');
    console.log('new value: ', transactions.newValue);
    console.log('old value: ', transactions.oldValue);
    chrome.browserAction.setBadgeText({ text: JSON.parse(transactions.newValue).length.toString() });
  }
});
