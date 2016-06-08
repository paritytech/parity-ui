import { combineReducers } from 'redux';
import transactions from './transactions';
import ws from './ws';
import logger from './logger';

export default combineReducers({
  transactions,
  ws,
  logger
});
