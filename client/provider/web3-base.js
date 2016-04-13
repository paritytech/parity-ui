
import Web3 from 'web3';
import EthcoreWeb3 from './web3-ethcore-provider';

export class Web3Base {
  constructor () {
    this.web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
    this.ethcoreWeb3 = new EthcoreWeb3(this.web3);
  }

}
