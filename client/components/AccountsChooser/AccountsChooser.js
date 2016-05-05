import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import styles from './styles.css';

import {Web3Component} from '../Web3Component/Web3Component';
import {Identicon} from '../Identicon/Identicon';

export class AccountChooser extends Web3Component {

  state = {
    defaultAccountIdx: 0,
    accounts: []
  };

  onTick (next) {
    this.context.web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return;
      }
      this.setState({accounts});
      this.props.onChange(this.state.accounts[this.state.defaultAccountIdx]);
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
        {this.shortenAddress(address)}
      </div>
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
