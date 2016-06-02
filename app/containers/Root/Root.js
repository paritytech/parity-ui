import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import Web3 from 'web3';
import { Web3Provider, Web3WebSocketProvider, MuiThemeProvider } from 'dapps-react-ui';
const web3WebSocketProvider = new Web3WebSocketProvider();
const web3 = new Web3(web3WebSocketProvider);

import '../../utils';
import App from '../App';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={ store}>
        <Web3Provider web3={ web3 }>
          <MuiThemeProvider>
            <App />
          </MuiThemeProvider>
        </Web3Provider>
      </Provider>
    );
  }
}
