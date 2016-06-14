import React, { Component } from 'react';

import TransactionFinished from './';

const transactions = [
  {
    id: '0x01',
    from: '0xB4C2328115Fb5A2D7503Cb11969A8f25f3456638',
    value: 87456893245,
    fee: 342532,
    txHash: '0xlKJHf4KLFHdfg',
    data: 'bla bla foo bar!',
    chain: 'morden',
    to: '0x575B71fa5dc1d8a23a242F70a70ae88d22B96107'
  },
  {
    id: '0x02',
    from: '0xB4C2328115Fb5A2D7503Cb11969A8f25f3456638',
    value: 87456893245,
    fee: 342532,
    chain: 'morden',
    to: '0x575B71fa5dc1d8a23a242F70a70ae88d22B96107'
  }
];

export default class TransactionDocs extends Component {
  render () {
    return (
      <div>
        <h1>Transaction Finished</h1>
        {
          transactions
          .map(
            t => <TransactionFinished { ...t } key={ t.id } />
          )
        }
      </div>
    );
  }
}
