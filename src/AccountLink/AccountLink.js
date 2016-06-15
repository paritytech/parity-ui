import React, { Component, PropTypes } from 'react';

import styles from './AccountLink.css';

export default class AccountLink extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    chain: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }

  state = {
    link: this.getLink(this.props.address)
  };

  componentWillReceiveProps (nextProps) {
    this.updateLink(nextProps.address);
  }

  render () {
    const { children, className } = this.props;
    return (
      <a
        href={ this.state.link }
        target='_blank'
        className={ `${styles.container} ${className}` }
        >
        { children }
      </a>
    );
  }

  getLink (address) {
    const base = this.props.chain === 'morden'
    ? 'https://testnet.etherscan.io/address/'
    : 'https://etherscan.io/address/';
    return base + address;
  }

  updateLink = (address) => {
    const link = this.getLink(address);
    this.setState({ link });
  };

}
