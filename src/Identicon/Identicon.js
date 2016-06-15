import React, { Component, PropTypes } from 'react';

import styles from './Identicon.css';
import AccountLink from '../AccountLink';

import * as blockies from 'blockies/blockies';

export default class Identicon extends Component {

  static propTypes = {
    className: PropTypes.string,
    chain: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  };

  state = {
    src: ''
  };

  componentDidMount () {
    this.updateIcon(this.props.address);
  }

  componentWillReceiveProps (newProps) {
    if (newProps.address === this.props.address) {
      return;
    }
    this.updateIcon(newProps.address);
  }

  updateIcon (address) {
    const dataUrl = blockies.create({
      address: address.toLowerCase(), // in case it's a checksummed address
      size: 8,
      scale: 8
    }).toDataURL();

    this.setState({
      src: dataUrl
    });
  }

  render () {
    const { address, chain, className } = this.props;

    return (
      <AccountLink acc={ address } className={ className } chain={ chain }>
        <img src={ this.state.src } className={ styles.icon } />
      </AccountLink>
    );
  }

}
