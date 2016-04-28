
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import './index.html';
import './index.css';
import 'dapp-styles/dapp-styles.less';

import './test.utils';

import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import localStore from 'store';
import request from 'browser-request';
import Web3 from 'web3';

import AppContainer from './containers/App';
import StatusPage from './containers/StatusPage';
import DebugPage from './containers/DebugPage';
import AccountsPage from './containers/AccountsPage';
import AppListPage from './containers/AppListPage';
import RpcPage from './containers/RpcPage';
import RpcCalls from './components/RpcCalls';
import RpcDocs from './components/RpcDocs';

import Middlewares from './middleware';
import configure from './store';
import {Web3Provider} from './provider/web3-provider';
import EthcoreWeb3 from './provider/web3-ethcore-provider';
import {initAppAction} from './actions/app';

const web3 = new Web3(new Web3.providers.HttpProvider('/rpc/'));
const ethcoreWeb3 = new EthcoreWeb3(web3);
const web3Interactions = new Middlewares.WebInteractions(web3, ethcoreWeb3);
const rpcMiddleware = new Middlewares.Rpc(request);
const localStorageMiddleware = new Middlewares.LocalStorage();
const toastrMiddleware = new Middlewares.Toastr();

const storeMiddlewares = [Middlewares.logger, web3Interactions.toMiddleware(), rpcMiddleware.toMiddleware(), localStorageMiddleware.toMiddleware(), toastrMiddleware.toMiddleware()];

const store = configure(storeMiddlewares);
const history = syncHistoryWithStore(hashHistory, store);

const muiTheme = getMuiTheme({
  fontFamily: `'Source Sans Pro', 'Helvetica Neue', arial, sans-serif`,
  palette: {
    primary1Color: '#6691C2',
    accent1Color: deepOrange500
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={history}>
        <Route path={'/'} component={AppContainer}>
          <IndexRedirect to='status' />
          <Route path={'status'} component={StatusPage} />
          <Route path={'debug'} component={DebugPage} />
          <Route path={'accounts'} component={AccountsPage} />
          <Route path={'apps'} component={AppListPage} />
          <Route path={'rpc'} component={RpcPage}>
            <IndexRedirect to='calls' />
            <Route path={'calls'} component={RpcCalls} />
            <Route path={'docs'} component={RpcDocs} />
          </Route>
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

new Web3Provider(web3, ethcoreWeb3, store).start();
store.dispatch(initAppAction());

(window || global).store = localStore;
(window || global).web3 = web3;
