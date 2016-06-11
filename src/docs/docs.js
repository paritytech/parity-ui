import '../index.html';
import React from 'react';
import ReactDOM from 'react-dom';

import Web3Provider from '../Web3Provider';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_ADDRESS || '/rpc/'));

import MuiThemeProvider from '../MuiThemeProvider';
import AccountWeb3Docs from '../AccountWeb3/AccountWeb3.docs';
import TransactionDocs from '../Transaction/Transaction.docs';
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
        <TransactionDocs />
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

