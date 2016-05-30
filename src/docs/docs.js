import '../index.html';
import React from 'react';
import ReactDOM from 'react-dom';

import AccountDocs from '../Account/Account.docs';
import AccountLinkDocs from '../AccountLink/AccountLink.docs';
import IdenticonDocs from '../Identicon/Identicon.docs';
import TransactionDocs from '../Transaction/Transaction.docs';

ReactDOM.render(
  <div>
    <AccountLinkDocs />
    <hr />
    <IdenticonDocs />
    <hr />
    <AccountDocs />
    <hr />
    <TransactionDocs />
    <hr />
  </div>,
  document.getElementById('root')
);
