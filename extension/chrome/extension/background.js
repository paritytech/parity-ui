import Transactions from './Transactions';
import ProxyManager from './ProxyManager';
import { getToken, onTokenChange } from '../utils/token';

const proxyManager = new ProxyManager();
const transactions = new Transactions();
onTokenChange(token => transactions.init(token));

proxyManager.init();

getToken(token => transactions.init(token));
