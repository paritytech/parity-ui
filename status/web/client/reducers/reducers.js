
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import status from './status';
import settings from './settings';
import mining from './mining';
import debug from './debug';
import rpc from './rpc';
import toastr from './toastr';
import logger from './logger';

export default combineReducers({
  routing,
  status,
  settings,
  mining,
  rpc,
  toastr,
  logger,
  debug
});
