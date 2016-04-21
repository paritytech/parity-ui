
import {isArray, eq, compact} from 'lodash';
import {isBigNumber} from 'web3/lib/utils/utils';
import {toPromise} from './util-provider';
import {Web3Base} from './web3-base';
import * as StatusActions from '../actions/status';
import * as MiningActions from '../actions/mining';
import * as DebugActions from '../actions/debug';

export class Web3Provider extends Web3Base {

  constructor (web3, ethcoreWeb3, store) {
    super(web3, ethcoreWeb3);
    this.store = store;
    this.delay = 500;
    this.state = {};
    this.running = false;
    this.tickArr = this.getTickArr();
  }

  onStart () {
    toPromise(this.web3.version.getNode, StatusActions.updateVersion);
  }

  onTick () {
    return Promise.all(this.tickArr.map((obj, idx) => {
      if (!obj.actionMaker) {
        console.error(obj);
        throw new Error(`Missing action creator for no ${idx}`);
      }
      return toPromise(obj.method).then(obj.actionMaker)
        .catch(err => {
          this.store.dispatch(StatusActions.error(err));
          return false; // don't process errors in the promise chain
        });
    }))
    .then(compact)
    .then(::this.filterChanged)
    .then(::this.updateState)
    .then(actions => actions.map(this.store.dispatch))
    .catch(err => {
      this.store.dispatch(StatusActions.error(err));
    });
  }

  getTickArr () {
    return [
      {method: this.web3.eth.getHashrate, actionMaker: StatusActions.updateHashrate},
      {method: this.web3.eth.getBlockNumber, actionMaker: StatusActions.updateBlockNumber},
      {method: this.web3.net.getPeerCount, actionMaker: StatusActions.updatePeerCount},
      {method: this.web3.eth.getCoinbase, actionMaker: MiningActions.updateAuthor},
      {method: this.ethcoreWeb3.getMinGasPrice, actionMaker: MiningActions.updateMinGasPrice},
      {method: this.ethcoreWeb3.getGasFloorTarget, actionMaker: MiningActions.updateGasFloorTarget},
      {method: this.ethcoreWeb3.getExtraData, actionMaker: MiningActions.updateExtraData},
      {method: this.ethcoreWeb3.getDevLogsLevels, actionMaker: DebugActions.updateDevLogsLevels},
      {method: this.ethcoreWeb3.getDevLogs, actionMaker: DebugActions.updateDevLogs},
      {method: this.ethcoreWeb3.getNetChain, actionMaker: StatusActions.updateNetChain},
      {method: this.ethcoreWeb3.getNetPort, actionMaker: StatusActions.updateNetPort},
      {method: this.ethcoreWeb3.getNetMaxPeers, actionMaker: StatusActions.updateNetMaxPeers},
      {method: this.ethcoreWeb3.getRpcSettings, actionMaker: StatusActions.updateRpcSettings}
    ];
  }

  nextDelay () {
    let noOfErrors = this.store.getState().status.noOfErrors;
    if (noOfErrors === 0) {
      return this.delay;
    }
    return this.delay * (1 + Math.log(noOfErrors));
  }

  start () {
    this.running = true;
    this.onStart();
    this.refreshTick();
    return () => this.running = false;
  }

  refreshTick () {
    if (!this.running) {
      return;
    }
    this.onTick().then(() => {
      setTimeout(::this.refreshTick, this.nextDelay());
    });
  }

  filterChanged (actions) {
    return actions.filter(action => {
      const val = this.state[this.actionProp(action)];
      if (isBigNumber(val)) {
        return !val.equals(action.payload);
      } if (isArray(val)) {
        return eq(val, action.payload);
      } else {
        return val !== action.payload;
      }
    });
  }

  updateState (actions) {
    return actions.map(action => {
      this.state[this.actionProp(action)] = action.payload;
      return action;
    });
  }

  actionProp (action) {
    return action.type.split(' ')[1];
  }

}
