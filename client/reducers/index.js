
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import status from './status';

export default combineReducers({
  routing,
  status
});
