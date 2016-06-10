import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import middlewares from '../middlewares';

const enhancer = compose(
  applyMiddleware(thunk, ...middlewares(tokenSetter))
);

export default function (tokenSetter) {
  return createStore(rootReducer, enhancer);
}

