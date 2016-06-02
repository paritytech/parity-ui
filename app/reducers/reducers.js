import { combineReducers } from 'redux';
import transactions from './transactions';
import logger from './logger';

export default combineReducers({
  transactions,
  logger
});
