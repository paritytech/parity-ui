import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import app from './app';
import toastr from './toastr';
import proxy from './proxy';
import parity from './parity';
import requests from './requests';
import ws from './ws';
import logger from './logger';

export default combineReducers({
  routing,
  app,
  toastr,
  proxy,
  parity,
  requests,
  ws,
  logger
});
