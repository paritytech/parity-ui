import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import Web3 from 'web3';
import { Web3Provider, MuiThemeProvider } from 'dapps-react-ui';

import './index.html';
import './index.css';
import './utils/logger';

import Web3WebSocketProvider from './providers/web3WebsocketProvider';
import WsProvider from './providers/wsProvider';

import middlewares from './middlewares';
import createStore from './store/configureStore';
import Routes from './routes';

export default function app (initToken, tokenSetter, addTokenListener) {
  const web3WebSocketProvider = new Web3WebSocketProvider(initToken, addTokenListener);
  const web3 = new Web3(web3WebSocketProvider);

  const store = createStore(middlewares(tokenSetter));
  ReactDOM.render(
    <Provider store={ store }>
      <Web3Provider web3={ web3 }>
        <MuiThemeProvider>
          <Routes store={ store } />
        </MuiThemeProvider>
      </Web3Provider>
    </Provider>,
    document.querySelector('#root')
  );

  const wsProvider = new WsProvider(store);
  wsProvider.init(initToken);
}
