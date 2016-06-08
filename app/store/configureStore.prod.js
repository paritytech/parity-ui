import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import middlewares from '../middlewares';

const enhancer = compose(
  applyMiddleware(thunk, ...middlewares())
);

export default function () {
  return createStore(rootReducer, enhancer);
}

