
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import status from './status';
import settings from './settings';
import mining from './mining';
import logs from './logs';

export default combineReducers({
  routing,
  status,
  settings,
  mining,
  logs
});
