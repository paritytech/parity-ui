
import React, { Component, PropTypes } from 'react';

import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import componentsData from '../components.data';
import RootContainer from '../containers/Root';
import WelcomePage from '../containers/WelcomePage';
import AccountPage from '../containers/AccountPage';

const routerHistory = useRouterHistory(createHashHistory)();

export default class Routes extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render () {
    const { store } = this.props;
    const history = syncHistoryWithStore(routerHistory, store);
    return (
      <Router history={ history }>
        <Route path={ '/' } component={ RootContainer }>
          <IndexRedirect to='/welcome' />
          <Route path={ '/welcome' } component={ WelcomePage } />
          <Route path={ '/account' } component={ AccountPage } />
        </Route>
      </Router>
    );
  }

}
