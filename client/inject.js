import './inject.html';

import ReactDOM from 'react-dom';
import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const muiTheme = getMuiTheme({});

import Web3 from 'web3';

import {Web3Provider} from './components/Web3Provider/Web3Provider';
import TopBar from './components/TopBar';

const http = new Web3.providers.HttpProvider('/rpc/');
const web3 = new Web3(http);
// expose global web3
global.web3 = web3;

// Render account chooser
const el = document.createElement('div');
document.querySelector('html').appendChild(el);
ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Web3Provider web3={web3}>
      <TopBar />
    </Web3Provider>
  </MuiThemeProvider>,
  el
);
