import './index.html';
import 'dapp-styles/dapp-styles.less';

import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import App from './containers/App';
import Accounts from './containers/Accounts';
import AppList from './containers/AppList';
import configure from './store';

const store = configure();
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={'/'} component={App} />
      <Route path={'/accounts'} component={Accounts} />
      <Route path={'/apps'} component={AppList} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
