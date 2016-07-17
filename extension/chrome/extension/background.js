import './background.html';
import Transactions from './Transactions';
import WebMessages from './WebMessages';
import ProxyManager from './ProxyManager';
import { getToken, onTokenChange } from '../utils/token';

const proxyManager = new ProxyManager();
const webMessages = new WebMessages();
const transactions = new Transactions();
onTokenChange(token => transactions.init(token));

proxyManager.init();
webMessages.init();

getToken(token => transactions.init(token));
