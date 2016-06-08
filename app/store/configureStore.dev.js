import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import middlewares from '../middlewares';

const enhancer = compose(
  applyMiddleware(thunk, ...middlewares()),
  window.devToolsExtension ? window.devToolsExtension() : nope => nope
);

export default function () {
  const store = createStore(rootReducer, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
