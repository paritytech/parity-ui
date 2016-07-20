import { isArray, isObject, isEqual, compact } from 'lodash';
import { isBigNumber } from 'web3/lib/utils/utils';
import { toPromise } from 'dapps-react-components/src/util/util';
import logger from 'dapps-react-components/src/util/logger';
import * as actions from '../actions/rpc';

export default class RpcProvider {

  state = {};
  delay = 500;

  constructor (store, web3) {
    this.store = store;
    this.web3 = web3;
    this.tickArr = this.getTickArr();
  }

  init () {
    this.refreshTick();
  }

  onTick () {
    if (this.store.getState().rpc.isDisconnected) {
      return this.onTickWhenDisconnected();
    }

    return Promise.all(this.tickArr.map((obj, idx) => {
      if (!obj.actionMaker) {
        logger.error(obj);
        throw new Error(`Missing action creator for no ${idx}`);
      }
      return toPromise(obj.method).then(obj.actionMaker)
        .catch(err => {
          logger.error(`err for ${obj.actionMaker().type}`);
          this.store.dispatch(actions.error(err));
          return false; // don't process errors in the promise chain
        });
    }))
    .then(compact)
    .then(this.filterChanged)
    .then(this.updateState)
    .then(actions => actions.map(this.store.dispatch))
    .catch(err => {
      logger.error(err);
      this.store.dispatch(actions.error(err));
    });
  }

  refreshTick = () => {
    this.onTick().then(() => {
      setTimeout(this.refreshTick, this.nextDelay());
    });
  }

  filterChanged = actions => {
    return actions.filter(action => {
      const val = this.state[this.actionToStateProp(action)];

      if (isBigNumber(val)) {
        return !val.equals(action.payload);
      }

      if (isArray(val) || isObject(val)) {
        return !isEqual(val, action.payload);
      }

      return val !== action.payload;
    });
  }

  updateState = actions => {
    return actions.map(action => {
      this.state[this.actionToStateProp(action)] = action.payload;
      return action;
    });
  }

  actionToStateProp (action) {
    return action.type.split(' ')[1];
  }

  onTickWhenDisconnected () {
    // When disconnected we are only checking single call.
    // After we connect again - onTick should refresh all other results.
    const call = this.tickArr[0];
    return toPromise(call.method)
      .then(call.actionMaker)
      .then(this.store.dispatch)
      .catch(err => {
        logger.warn(err);
        this.store.dispatch(actions.error(err));
      });
  }

  nextDelay () {
    let { errorCount } = this.store.getState().rpc;
    if (errorCount === 0) {
      return this.delay;
    }
    return this.delay * (1 + Math.log(errorCount));
  }

  getTickArr () {
    const arr = [
      { method: this.web3.version.getNetwork, actionMaker: actions.updateNetwork },
      { method: this.web3.personal.signerEnabled, actionMaker: actions.updateSignerPort },
      { method: this.web3.eth.getAccounts, actionMaker: actions.updateAccounts },
      { method: this.web3.eth.getSyncing, actionMaker: actions.updateSyncing },
      { method: this.web3.eth.getBlockNumber, actionMaker: actions.updateLatestBlock },
      { method: this.web3.net.getPeerCount, actionMaker: actions.updatePeers }
    ];
    if (this.store.getState().rpc.signerPort) {
      arr.push({ method: this.web3.ethcore.unsignedTransactionsCount, actionMaker: actions.updateUnsignedTransactionsCount });
    }
    return arr;
  }

}
