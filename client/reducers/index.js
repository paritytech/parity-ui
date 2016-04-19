
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import status from './status';
import settings from './settings';
import mining from './mining';
import rpc from './rpc';

export default combineReducers({
  routing,
  status,
  settings,
  rpc,
  mining
});
