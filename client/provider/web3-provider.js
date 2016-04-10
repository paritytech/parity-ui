
import Web3 from 'web3';
import * as Actions from '../actions/status';

export class Web3Provider {

  constructor (store) {
    this.store = store;
    this.delay = 500;
    this.web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
  }

  onStart () {
    this.invoke(this.web3.version.getNode, Actions.updateVersion);
  }

  onTick () {
    this.invoke(this.web3.eth.getHashrate, Actions.updateHashrate);
    this.invoke(this.web3.eth.getBlockNumber, Actions.updateBlockNumber);
  }

  invoke (method, action) {
    method((err, res) => {
      if (err) {
        this.store.dispatch(Actions.error(err));
        return;
      }
      this.store.dispatch(action(res));
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
      that.onTick();
      setTimeout(refresh, that.nextDelay());
    }

    this.onStart();
    refresh();
    return () => running = false;
  }
}
