import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
// import IconButton from 'material-ui/IconButton';
// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import styles from './Header.css';

export default class Header extends Component {

  static propTypes = {
    isConnected: PropTypes.bool.isRequired
  }

  title = this.isExtension() ? 'Parity Signer UI' : 'Parity Signer UI (DAPP)';
  styles = {
    backgroundColor: this.isExtension() ? '#6691C2' : '#FF5722'
  };

  render () {
    return (
      <AppBar
        title={ this.title }
        className={ styles.bar }
        style={ this.styles }
        showMenuIconButton={ false }
        iconElementRight={ this.renderMenu() }
      />
    );
  }

  renderMenu () {
    return null; // until settings are tested and operational
    // if (!this.props.isConnected) {
    //   return null;
    // }

    // return (
    //   <IconMenu
    //     iconButtonElement={
    //       <IconButton><MoreVertIcon /></IconButton>
    //     }
    //     targetOrigin={ { horizontal: 'right', vertical: 'top' } }
    //     anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
    //   >
    //     <Link to={ '/transactions' } activeClassName='active'>
    //       <MenuItem primaryText='Transactions' />
    //     </Link>
    //     <Link to={ '/options' } activeClassName='active'>
    //       <MenuItem primaryText='Settings' />
    //     </Link>
    //   </IconMenu>
    // );
  }

  isExtension () {
    return window.location.protocol.indexOf('chrome-extension') > -1;
  }

}
