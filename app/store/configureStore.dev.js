import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import middlewares from '../middlewares';


export default function (tokenSetter) {
  const enhancer = compose(
    applyMiddleware(thunk, ...middlewares(tokenSetter)),
    window.devToolsExtension ? window.devToolsExtension() : nope => nope
  );
  const store = createStore(rootReducer, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
