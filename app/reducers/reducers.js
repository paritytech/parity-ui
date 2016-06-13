import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import app from './app';
import proxy from './proxy';
import transactions from './transactions';
import ws from './ws';
import logger from './logger';

export default combineReducers({
  routing,
  app,
  proxy,
  transactions,
  ws,
  logger
});
