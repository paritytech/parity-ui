import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import storage from '../utils/storage';
import middlewares from '../middlewares';

const enhancer = compose(
  applyMiddleware(thunk, ...middlewares()),
  storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
