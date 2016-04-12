
import {Web3Base} from './web3-base';
import * as StatusActions from '../actions/status';
import * as MiningActions from '../actions/mining';

export class Web3Provider extends Web3Base {

  constructor (store) {
    super();
    this.store = store;
    this.delay = 500;
  }

  onStart () {
    this.invoke(this.web3.version.getNode, StatusActions.updateVersion);
  }

  onTick () {
    return Promise.all([
      this.invoke(this.web3.eth.getHashrate).then(StatusActions.updateHashrate),
      this.invoke(this.web3.eth.getBlockNumber).then(StatusActions.updateBlockNumber),
      this.invoke(this.web3.net.getPeerCount).then(StatusActions.updatePeerCount),
      this.invoke(this.web3.eth.getCoinbase).then(MiningActions.updateAuthor),
      this.invoke(this.ethcoreWeb3.getMinGasPrice).then(MiningActions.updateMinGasPrice),
      this.invoke(this.ethcoreWeb3.getGasFloorTarget).then(MiningActions.updateGasFloorTarget),
      this.invoke(this.ethcoreWeb3.getExtraData).then(MiningActions.updateExtraData)
    ]).then((res) => {
      res.map(this.store.dispatch);
    }).catch((err) => {
      this.store.dispatch(StatusActions.error(err));
    });
  }

  invoke (method) {
    return new Promise((resolve, reject) => {
      method((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  nextDelay () {
    let noOfErrors = this.store.getState().status.noOfErrors;
    if (noOfErrors === 0) {
      return this.delay;
    }
    return this.delay * (1 + Math.log(noOfErrors));
  }

  start () {
    let running = true;
    let that = this;

    function refresh () {
      if (!running) {
        return;
      }
      that.onTick().then(() => {
        setTimeout(refresh, that.nextDelay());
      });
    }

    this.onStart();
    refresh();
    return () => running = false;
  }

}
