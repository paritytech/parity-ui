
import React, { Component, PropTypes } from 'react';

import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import RootContainer from '../containers/Root';
import LoadingPage from '../containers/LoadingPage';
import OptionsPage from '../containers/OptionsPage';
import TransactionsPage from '../containers/TransactionsPage';
import UnAuthorizedPage from '../containers/UnAuthorizedPage';

const routerHistory = useRouterHistory(createHashHistory)({
  queryKey: false
});

export default class Routes extends Component {

  render () {
    const { store } = this.props;
    const history = syncHistoryWithStore(routerHistory, store);
    return (
      <Router history={ history }>
        <Route component={ RootContainer }>
          <Route path={ '/loading' } component={ LoadingPage } />
          <Route path={ '/unAuthorized' } component={ UnAuthorizedPage } />
          <Route path={ '/' } onEnter={ this.requireAuth }>
            <IndexRedirect to='transactions' />
            <Route path={ 'transactions' } component={ TransactionsPage } />
            <Route path={ 'options' } component={ OptionsPage } />
          </Route>
        </Route>
      </Router>
    );
  }

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  requireAuth = (nextState, replace) => {
    const { app, ws } = this.props.store.getState();
    if (app.isLoading) {
      return replace('/loading');
    }

    if (!ws.isConnected) {
      return replace('/unAuthorized');
    }
  };

}
