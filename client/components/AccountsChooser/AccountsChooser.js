import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {Web3Component} from '../Web3Component/Web3Component';

export class AccountChooser extends Web3Component {

  state = {
    defaultAccountIdx: 0,
    accounts: []
  };

  onTick (next) {
    this.context.web3.eth.getAccounts((err, accounts) => {
      this.setState({accounts});
    });
  }

  handleChange (e, index, value) {
    this.setState({
      defaultAccountIdx: value 
    });
  }

  render () {
    return (
      <DropDownMenu value={this.state.defaultAccountIdx} onChange={::this.handleChange}>
        {this.state.accounts.map((acc, idx) => (
          <MenuItem
            key={acc}
            value={idx}
            primaryText={acc} />
        ))}
      </DropDownMenu>
    );
  }

}
