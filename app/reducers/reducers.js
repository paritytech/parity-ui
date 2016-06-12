import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import transactions from './transactions';
import app from './app';
import ws from './ws';
import logger from './logger';

export default combineReducers({
  routing,
  app,
  transactions,
  ws,
  logger
});
