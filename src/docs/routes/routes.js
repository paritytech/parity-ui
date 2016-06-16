
import React, { Component, PropTypes } from 'react';

import { Router, Route, useRouterHistory, IndexRedirect } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import componentsData from '../components.data';
import RootContainer from '../containers/Root';
import WelcomePage from '../containers/WelcomePage';
import AccountPage from '../containers/AccountPage';
import AccountLinkPage from '../containers/AccountLinkPage';
import IdenticonPage from '../containers/IdenticonPage';
import RpcAutoCompletePage from '../containers/RpcAutoCompletePage';
import ToastPage from '../containers/ToastPage';
import TransactionFinishedPage from '../containers/TransactionFinishedPage';
import TransactionPendingPage from '../containers/TransactionPendingPage';
import TransactionPendingFormPage from '../containers/TransactionPendingFormPage';

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
          <IndexRedirect to='welcome' />
          <Route path={ 'welcome' } component={ WelcomePage } />
          <Route path={ 'account' } component={ AccountPage } />
          <Route path={ 'AccountLink' } component={ AccountLinkPage } />
          <Route path={ 'identicon' } component={ IdenticonPage } />
          <Route path={ 'rpcAutoComplete' } component={ RpcAutoCompletePage } />
          <Route path={ 'toast' } component={ ToastPage } />
          <Route path={ '/transactionFinished' } component={ TransactionFinishedPage } />
          <Route path={ '/transactionPending' } component={ TransactionPendingPage } />
          <Route path={ '/transactionPendingForm' } component={ TransactionPendingFormPage } />
        </Route>
      </Router>
    );
  }
}
