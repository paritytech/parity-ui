import Transactions from './Transactions';
import ProxyManager from './ProxyManager';
import { getToken, onTokenChange } from '../utils/token';

const proxyManager = new ProxyManager();
const transactions = new Transactions();

proxyManager.init();

getToken(transactions.init);
onTokenChange(transactions.init);
