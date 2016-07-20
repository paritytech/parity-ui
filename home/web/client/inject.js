import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import stylesReset from './reset.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});

import Web3 from 'web3'; // must b after ./test otherwise it breaks

import web3extensions from 'dapps-react-components/src/util/web3.extensions';
import Web3Provider from 'dapps-react-components/src/Web3Provider';
import Root from './components/Root';
import Interceptor from './utils/Interceptor';
import InterceptorProvider from './providers/interceptor';
import DomProvider from './providers/dom';
import RpcProvider from './providers/rpc';
import ExtensionProvider from './providers/extension';
import readInjectOptions from './utils/readInjectOptions';
import createStore from './store/configureStore';
import middlewares from './middlewares';
import { initApp } from './actions/app';

const http = new Web3.providers.HttpProvider('/rpc/');
const interceptor = new Interceptor(http);
const exposedWeb3 = new Web3(interceptor);

const internalWeb3 = new Web3(http);
web3extensions(internalWeb3)
  .map(extension => internalWeb3._extend(extension));

// expose global web3
global.web3 = exposedWeb3;
const options = readInjectOptions();

// Render account chooser
const el = document.createElement('div');
document.querySelector('html').appendChild(el);

const store = createStore(middlewares(internalWeb3), { options });

// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={ store }>
    <div className={ stylesReset.reset }>
      <Web3Provider web3={ internalWeb3 }>
        <MuiThemeProvider muiTheme={ muiTheme }>
          <Root />
        </MuiThemeProvider>
      </Web3Provider>
    </div>
  </Provider>,
  el
);

const domProvider = new DomProvider(store);
domProvider.init();

const rpcProvider = new RpcProvider(store, internalWeb3);
rpcProvider.init();

const extensionProvider = new ExtensionProvider(store);
extensionProvider.init();

// IMPORTANT! Interceptor provider must be set in synchronous order after exposing web3
const interceptorProvider = new InterceptorProvider(store, interceptor);
interceptorProvider.init();

store.dispatch(initApp());

// todo
// storageProvider and rpcProvider need to communicate for this
// might be easier to get this from server with a single call
// handleFirstRun = allAccounts => {
//   this.handleFirstRun = () => {}; // change to noop after first tick
//   this.storage.getNotFirstRun(notFirstRun => {
//     if (notFirstRun) {
//       return;
//     }
//     this.storage.saveNotFirstRun();
//     if (allAccounts.length) {
//       return;
//     }
//     this.onOpenCreateAccount();
//   });
// }
