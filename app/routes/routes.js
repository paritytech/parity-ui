
import React, { Component, PropTypes } from 'react';

import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import RootContainer from '../containers/Root';
import TransactionsPage from '../containers/TransactionsPage';
import UnAuthorizedPage from '../containers/UnAuthorizedPage';

const routerHistory = useRouterHistory(createHashHistory)({
  queryKey: false
});

export default class Routes extends Component {

  render () {
    const history = syncHistoryWithStore(routerHistory, this.props.store);
    return (
      <Router history={ history }>
        <Route path={ '/' } component={ RootContainer }>
          <IndexRedirect to='transactions' />
          <Route path={ 'transactions' } component={ TransactionsPage } />
          <Route path={ 'unAuthorized' } component={ UnAuthorizedPage } />
        </Route>
      </Router>
    );
  }

  static propTypes = {
    store: PropTypes.object.isRequired
  }

}
