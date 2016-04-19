
import {Web3Base} from '../provider/web3-base';
import {modifyExtraData} from '../actions/modify-mining';

export default class WebInteractions extends Web3Base {

  constructor (web3, ethcoreWeb3) {
    super(web3, ethcoreWeb3);
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type.indexOf('modify ') > -1) {
        this.ethcoreWeb3[this.getMethod(action.type)](action.payload);
        action.type = action.type.replace('modify ', 'update ');
      }
      return next(action);
    };
  }

  toResetExtraDataMiddleware () {
    return store => next => action => {
      if (action.type !== 'reset extraData') {
        return next(action);
      }

      // TODO :: get real value
      store.dispatch(modifyExtraData('Parity / 2.1'));
      return next(action);
    };
  }

  getMethod (actionType) {
    let method = actionType.split('modify ')[1];
    return 'set' + method[0].toUpperCase() + method.slice(1);
  }
}
