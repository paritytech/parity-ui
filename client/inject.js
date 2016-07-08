import 'babel-polyfill';
import stylesReset from './reset.css';
import ReactDOM from 'react-dom';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap, for material ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import Web3 from 'web3';

import web3extensions from './components/web3.extensions';
import Web3Provider from './components/Web3Provider';
import TopBar from './components/TopBar';
import Interceptor from './components/TopBar/Interceptor';
import readInjectOptions from './utils/readInjectOptions';

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

ReactDOM.render(
  // wrapping id used to resest css, see inject.css
  <div className={ stylesReset.reset }>
    <Web3Provider web3={ rawWeb3 }>
      <TopBar
        interceptor={ interceptor }
        web3={ web3 }
        options={ options }
        />
    </Web3Provider>
  </div>,
  el
);
