import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { isEqual } from 'lodash';

import Web3Component from '../Web3Component';
import Account from 'dapps-react-components/src/Account';
import Storage from '../Storage';

import styles from './AccountChooser.css';

export default class AccountChooser extends Web3Component {
  // IE9 - contextTypes are not inherited
  static contextTypes = Web3Component.contextTypes;

  state = {
    defaultAccountIdx: 0
  };

  storage = Storage.local();

  componentWillMount () {
    this.refreshLastSelectedAccount(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (isEqual(nextProps.accounts, this.props.accounts)) {
      return;
    }

    this.refreshLastSelectedAccount(nextProps);
  }

  refreshLastSelectedAccount (props) {
    const { accounts } = props;
    this.storage.getLastAccount(lastAccount => {
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
    const { network, accountsNames, accounts } = this.props;
    return (
      <DropDownMenu
        autoWidth={ false }
        className={ styles.accounts }
        value={ this.state.defaultAccountIdx }
        onChange={ ::this.handleChange }
        maxHeight={ 700 }
        styles={ menuStyles }
        underlineStyle={ { display: 'none' } }
        iconStyle={ { fill: '#888' } }
        >
        {
          accounts.map((acc, idx) => (
            <MenuItem
              key={ acc }
              value={ idx }
              primaryText={
                <Account chain={ network } address={ acc } name={ accountsNames[acc] } />
              }
            />
          ))
        }

      </DropDownMenu>
    );
  }

  static propTypes = {
    accountsNames: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    network: React.PropTypes.string
  };

}

const menuStyles = { width: '350px' };
