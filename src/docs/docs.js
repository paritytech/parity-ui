import '../index.html';
import React from 'react';
import ReactDOM from 'react-dom';

import Web3Provider from '../Web3Provider';
import Web3 from 'web3';
import web3extensions from '../util/web3.extensions';

const http = new Web3.providers.HttpProvider(process.env.RPC_ADDRESS || '/rpc/');
const web3 = new Web3(http);
web3._extend(web3extensions(web3));
global.web3 = web3;

import MuiThemeProvider from '../MuiThemeProvider';
import AccountWeb3Docs from '../AccountWeb3/AccountWeb3.docs';
import TransactionPendingWeb3Docs from '../TransactionPendingWeb3/TransactionPendingWeb3.docs';
import TransactionFinishedDocs from '../TransactionFinished/TransactionFinished.docs';
import AccountLinkDocs from '../AccountLink/AccountLink.docs';
import IdenticonDocs from '../Identicon/Identicon.docs';
import RpcAutoCompleteDocs from '../RpcAutoComplete/RpcAutoComplete.docs';

ReactDOM.render(
  <MuiThemeProvider>
    <Web3Provider web3={ web3 }>
      <div>
        <TransactionFinishedDocs />
        <hr />
        <TransactionPendingWeb3Docs />
        <hr />
        <RpcAutoCompleteDocs />
        <hr />
        <AccountLinkDocs />
        <hr />
        <IdenticonDocs />
        <hr />
        <AccountWeb3Docs />
        <hr />
      </div>
    </Web3Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

