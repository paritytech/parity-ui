import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { updateToken } from './actions/ws';
import { initApp } from './actions/app';
import WsProvider from './providers/wsProvider';
import './utils/logger';
import Web3 from 'web3';
import { Web3Provider, MuiThemeProvider } from 'dapps-react-ui';
import Web3WebSocketProvider from './providers/web3WebsocketProvider';
import createStore from './store/configureStore';
import Root from './containers/Root';

export default (initToken, tokenSetter, tokenListener) => {

  const web3WebSocketProvider = new Web3WebSocketProvider(initToken, tokenListener);
  const web3 = new Web3(web3WebSocketProvider);

  
  const store = createStore();
  store.dispatch(initApp());
  ReactDOM.render(
    <Provider store={ store}>
      <Web3Provider web3={ web3 }>
        <MuiThemeProvider>
          <Root />
        </MuiThemeProvider>
      </Web3Provider>
    </Provider>,
    document.querySelector('#root')
  );

  const wsProvider = new WsProvider(store);
  wsProvider.init(initToken);
}
