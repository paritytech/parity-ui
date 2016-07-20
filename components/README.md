# DApps React Components

A set of (potentially) re-usable React components for DApp development.

[Back to parity-ui](../)

## Installation

```bash
$ npm install --save dapps-react-components # Old version name: dapps-react-ui
```

Remember to also install all required peer dependencies:

```bash
$ npm i --save material-ui@0.15 react@15.0 react-addons-css-transition-group@15.1 react-tap-event-plugin@1.0 react-tooltip@2.0
```

## Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import { Web3Provider, MuiThemeProvider } from 'dapps-react-components';
import { AccountWeb3 } from 'dapps-react-components';

const web3 = typeof web3 === 'undefined' ? new Web3(new Web3.providers.HttpProvider()) : web3;

ReactDOM.render(
  <Web3Provider web3={ web3 }>
    <MuiThemeProvider>
      <AccountWeb3
        address='0xbf4ed7b27f1d666546e30d74d50d173d20bca754'
        chain='homestead'
      />
    </MuiThemeProvider>
  </Web3Provider>
, document.body.querySelector('#app'));

```

## TODO

1. Documentation for Components
1. Auto-publishing
1. Better polling heuristics
1. Development for Components docs.


## Development

It's currently not possible to work on components in isolation. Work on [Signer](../signer/README.md) or [Home Page](../home/README.md) instead.

---

Head to [parity-ui](../) to learn how to build Parity with your changes.


