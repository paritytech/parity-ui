import './background.html';
import Transactions from './Transactions';
import WebMessages from './WebMessages';
import ProxyManager from './ProxyManager';
import { getToken, onTokenChange } from '../utils/token';

const proxyManager = new ProxyManager();
const webMessages = new WebMessages();
const transactions = new Transactions();

webMessages.init();

transactions.onOpen(() => {
  // Re-initialize proxy each time we are connected
  proxyManager.init();
});

onTokenChange(token => transactions.init(token));
getToken(token => transactions.init(token));
