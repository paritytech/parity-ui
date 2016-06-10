import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import transactions from './transactions';
import ws from './ws';
import logger from './logger';

export default combineReducers({
  routing,
  transactions,
  ws,
  logger
});
