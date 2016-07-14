import 'babel-polyfill';
import stylesReset from './reset.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});

import Web3 from 'web3'; // must b after ./test otherwise it breaks

import web3extensions from 'dapps-react-components/src/util/web3.extensions';
import Web3Provider from 'dapps-react-components/src/Web3Provider';
import Root from './components/Root';
import TopBar from './components/TopBar';
import Interceptor from './utils/Interceptor';
import readInjectOptions from './utils/readInjectOptions';
import createStore from './store/configureStore';
import middlewares from './middlewares';

const http = new Web3.providers.HttpProvider('/rpc/');
const interceptor = new Interceptor(http);
const web3 = new Web3(interceptor);
const rawWeb3 = new Web3(http);
web3extensions(rawWeb3)
  .map(extension => rawWeb3._extend(extension));

// expose global web3
global.web3 = web3;
const options = readInjectOptions();

// Render account chooser
const el = document.createElement('div');
document.querySelector('html').appendChild(el);

const store = createStore(middlewares());

ReactDOM.render(
  <Provider store={ store }>
    <div className={ stylesReset.reset }>
      <Web3Provider web3={ rawWeb3 }>
        <MuiThemeProvider muiTheme={ muiTheme }>
          <Root
            interceptor={ interceptor }
            options={ options }
          />
        </MuiThemeProvider>
      </Web3Provider>
    </div>
  </Provider>,
  el
);
