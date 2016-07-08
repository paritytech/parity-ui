import './index.html';

import ReactDOM from 'react-dom';
import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme({});

import Web3Provider from './components/Web3Provider';
import Home from './components/Home';

if (!global.web3) {
  throw new Error('Create global web3 instance first!');
}

ReactDOM.render(
  <Web3Provider web3={ global.web3 }>
    <MuiThemeProvider muiTheme={ muiTheme }>
      <Home />
    </MuiThemeProvider>
  </Web3Provider>,
  document.querySelector('#home')
);
