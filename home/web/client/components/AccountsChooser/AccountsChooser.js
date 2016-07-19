import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateActiveAccount } from '../../actions/rpc';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Account from '../Account';

import styles from './AccountChooser.css';

class AccountChooser extends Component {

  static propTypes = {
    network: PropTypes.string.isRequired,
    activeAccount: PropTypes.string.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.string).isRequired,
    accountsNames: PropTypes.object.isRequired,
    onSelectAccount: PropTypes.func.isRequired
  };

  render () {
    const { network, accountsNames, activeAccount, accounts } = this.props;
    return (
      <DropDownMenu
        autoWidth={ false }
        className={ styles.accounts }
        value={ activeAccount }
        onChange={ this.handleChange }
        maxHeight={ 700 }
        style={ menuStyles }
        underlineStyle={ { display: 'none' } }
        iconStyle={ { fill: '#888' } }
        >
        {
          accounts.map((acc, idx) => (
            <MenuItem
              key={ acc }
              value={ acc }
              primaryText={
                <Account
                  chain={ network }
                  address={ acc }
                  name={ accountsNames[acc] }
                />
              }
              />
          ))
        }

      </DropDownMenu>
    );
  }

  handleChange = (e, index, account) => {
    this.props.onSelectAccount(account);
  }

}

function mapStateToProps (state) {
  const { network, accounts, accountsNames, activeAccount } = state.rpc;
  return { network, accounts, accountsNames, activeAccount };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ onSelectAccount: updateActiveAccount }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountChooser);

const menuStyles = { width: '350px' };
