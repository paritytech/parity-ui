import React from 'react';

import {Account} from '../Account/Account';
import {Web3Component} from '../Web3Component/Web3Component';

export class Wallet extends Web3Component {

  render () {
    const { accounts } = this.props;
    if (!accounts.length) {
      return (
        <h1>You don't have any accounts yet.</h1>
      );
    }

    return (
      <div>
        <h1>Your accounts</h1>
        {
          accounts.map(acc => (
            <Account address={acc} />
          ))
        }
      </div>
    );
  }

  static propTypes = {
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };
}
