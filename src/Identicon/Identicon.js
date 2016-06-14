import React, { Component, PropTypes } from 'react';

import styles from './Identicon.css';
import AccountLink from '../AccountLink';

import * as blockies from 'blockies/blockies';

export default class Identicon extends Component {

  static propTypes = {
    className: PropTypes.string,
    chain: PropTypes.string.isRequired,
    seed: PropTypes.string.isRequired
  };

  state = {
    src: ''
  };

  componentDidMount () {
    this.updateIcon(this.props.seed);
  }

  componentWillReceiveProps (newProps) {
    if (newProps.seed === this.props.seed) {
      return;
    }
    this.updateIcon(newProps.seed);
  }

  updateIcon (seed) {
    const dataUrl = blockies.create({
      seed: seed.toLowerCase(), // in case it's a checksummed address
      size: 8,
      scale: 8
    }).toDataURL();

    this.setState({
      src: dataUrl
    });
  }

  render () {
    const { seed, chain, className } = this.props;

    return (
      <AccountLink acc={ seed } className={ className } chain={ chain }>
        <img src={ this.state.src } className={ styles.icon } />
      </AccountLink>
    );
  }

}
