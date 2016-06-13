import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import styles from './Header.css';

export default class Header extends Component {

  static propTypes = {
    isConnected: PropTypes.bool.isRequired
  }

  render () {
    return (
      <div className={ styles.container }>
        <AppBar
          title='Parity System UI'
          showMenuIconButton={ false }
          iconElementRight={ this.renderMenu() }
        />
      </div>
    );
  }

  renderMenu () {
    if (!this.props.isConnected) {
      return null;
    }

    return (
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={ { horizontal: 'right', vertical: 'top' } }
        anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
      >
        <Link to={ '/transactions' } activeClassName='active'>
          <MenuItem primaryText='Transactions' />
        </Link>
        <Link to={ '/options' } activeClassName='active'>
          <MenuItem primaryText='Settings' />
        </Link>
      </IconMenu>
    );
  }

}
