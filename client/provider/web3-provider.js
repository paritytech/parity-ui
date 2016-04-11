
import Web3 from 'web3';
import * as StatusActions from '../actions/status';
import * as MiningActions from '../actions/mining';

export class Web3Provider {

  constructor (store) {
    this.store = store;
    this.delay = 500;
    this.web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
  }

  onStart () {
    this.invoke(this.web3.version.getNode, StatusActions.updateVersion);
  }

  onTick () {
    let p1 = this.invoke(this.web3.eth.getHashrate, StatusActions.updateHashrate);
    let p2 = this.invoke(this.web3.eth.getBlockNumber, StatusActions.updateBlockNumber);
    let p3 = this.getAddress();
    return Promise.all([p1, p2, p3]).catch(() => {});
  }

  invoke (method, action) {
    return new Promise((resolve, reject) => {
      method((err, res) => {
        if (err) {
          this.store.dispatch(StatusActions.error(err));
          reject(err);
        } else {
          this.store.dispatch(action(res));
          resolve();
        }
      });
    });
  }

  getAddress () {
    this.invoke(this.web3.eth.getCoinbase, MiningActions.updateAddress);
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
