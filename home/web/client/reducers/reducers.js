import { combineReducers } from 'redux';
import toastr from 'dapps-react-components/src/reducers/toastr';
import logger from 'dapps-react-components/src/reducers/logger';
import extension from './extension';
import dom from './dom';
import dapps from './dapps';
import pendingTransaction from './pendingTransaction';
import options from './options';
import rpc from './rpc';

export default combineReducers({
  toastr,
  logger,
  extension,
  dom,
  dapps,
  pendingTransaction,
  options,
  rpc
});
