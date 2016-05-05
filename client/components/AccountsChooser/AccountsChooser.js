import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {isEqual} from 'lodash';

import styles from './styles.css';

import {Web3Component} from '../Web3Component/Web3Component';
import {Identicon} from '../Identicon/Identicon';

export class AccountChooser extends Web3Component {

  state = {
    defaultAccountIdx: 0,
    accounts: [],
    balances: {}
  };

  onTick (next) {
    this.context.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return;
      }

      if (isEqual(accounts, this.state.accounts)) {
        return;
      }

      this.setState({accounts});
      this.fetchBalances(accounts);
      this.props.onChange(this.state.accounts[this.state.defaultAccountIdx]);
    });
  }

  fetchBalances (accounts) {
    Promise.all(accounts.map((acc) => new Promise((resolve, reject) => {
      this.context.web3.eth.getBalance(acc, (err, balance) => {
        if (err) {
          return reject(err);
        }
        resolve({
          acc, balance
        });
      });
    }))).then((balances) => {
      this.setState({
        balances: balances.reduce((memo, acc) => {
          memo[acc.acc] = acc.balance;
          return memo;
        }, {})
      });
    });
  }

  handleChange (e, index, value) {
    this.setState({
      defaultAccountIdx: value
    });

    this.props.onChange(this.state.accounts[value]);
  }

  renderAccount (acc) {
    const address = this.context.web3.toChecksumAddress(acc);
    return (
      <div className={styles.account}>
        <Identicon seed={acc} />
        <span className={styles.address}>
          {this.shortenAddress(address)}
        </span>
        {this.renderBalance(acc)}
      </div>
    );
  }

  renderBalance (acc) {
    const balance = this.state.balances[acc];
    if (!balance) {
      return (
        <span> (...)</span>
      );
    }
    const val = this.context.web3.fromWei(balance);
    return (
      <span> ({val.toFixed(2)} Eth)</span>
    );
  }

  shortenAddress (acc) {
    const len = acc.length;
    return acc.slice(0, 8) + '...' + acc.slice(len - 8);
  }

  render () {
    return (
      <div>
        <DropDownMenu value={this.state.defaultAccountIdx} onChange={::this.handleChange}>
          {this.state.accounts.map((acc, idx) => (
            <MenuItem
              key={acc}
              value={idx}
              primaryText={this.renderAccount(acc)} />
          ))}
        </DropDownMenu>
      </div>
    );
  }

  static propTypes = {
    onChange: React.PropTypes.func.isRequired
  };

}
