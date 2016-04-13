
import {Web3Base} from '../provider/web3-base';

const Web3 = new Web3Base();

export default store => next => action => {
  if (action.type.indexOf('modify ') > -1) {
    Web3.ethcoreWeb3[getMethod(action.type)](action.payload);
    action.type = action.type.replace('modify ', 'update ');
  }
  return next(action);
};

function getMethod (actionType) {
  let method = actionType.split('modify ')[1];
  return 'set' + method[0].toUpperCase() + method.slice(1);
}
