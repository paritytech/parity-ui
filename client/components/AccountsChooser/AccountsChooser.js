import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import isEqual from 'lodash.isequal';

import Web3Component from '../Web3Component';
import Account from '../Account';
import Storage from '../Storage';

import styles from './AccountChooser.css';

export default class AccountChooser extends Web3Component {

  state = {
    defaultAccountIdx: 0
  };

  storage = Storage.local();

  componentWillReceiveProps (nextProps) {
    const { accounts } = nextProps;

    if (isEqual(accounts, this.props.accounts)) {
      return;
    }

    this.storage.getLastAccount((lastAccount) => {
      const idx = accounts.indexOf(lastAccount);
      const defaultAccountIdx = idx !== -1 ? idx : this.state.defaultAccountIdx;

      this.setState({
        defaultAccountIdx
      });

      this.props.onChange(accounts[defaultAccountIdx]);
    });
  }

  handleChange (e, index, value) {
    this.setState({
      defaultAccountIdx: value
    });
    const account = this.props.accounts[value];
    this.storage.saveLastAccount(account);
    this.props.onChange(account);
  }

  render () {
    return (
      <DropDownMenu
        autoWidth={false}
        className={styles.accounts}
        value={this.state.defaultAccountIdx}
        onChange={::this.handleChange}
        maxHeight={700}
        styles={menuStyles}
        underlineStyle={{display: 'none'}}
        iconStyle={{ fill: '#888' }}
        >
        <MenuItem
          key={'choose'}
          value={-1}
          primaryText='choose account for this dapp' />
        {this.props.accounts.map((acc, idx) => (
          <MenuItem
            key={acc}
            value={idx}
            primaryText={<Account address={acc} name={this.props.accountsNames[acc]}/>} />
        ))}

      </DropDownMenu>
    );
  }

  static propTypes = {
    accountsNames: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

}

const menuStyles = {width: '350px'};
