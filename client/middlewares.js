import Web3 from 'web3';
import request from 'browser-request';
import Middlewares from './middleware';
import EthcoreWeb3 from './provider/web3-ethcore-provider';

const web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
const ethcoreWeb3 = new EthcoreWeb3(web3);
const web3Interactions = new Middlewares.WebInteractions(web3, ethcoreWeb3);
const rpcMiddleware = new Middlewares.Rpc(request);
const localStorageMiddleware = new Middlewares.LocalStorage();
const toastrMiddleware = new Middlewares.Toastr();

export default [
  Middlewares.logger,
  web3Interactions.toMiddleware(),
  rpcMiddleware.toMiddleware(),
  localStorageMiddleware.toMiddleware(),
  toastrMiddleware.toMiddleware()
];
