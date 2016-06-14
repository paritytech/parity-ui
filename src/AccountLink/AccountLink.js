import React, { Component, PropTypes } from 'react';

import styles from './AccountLink.css';

export default class AccountLink extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    chain: PropTypes.string.isRequired,
    acc: PropTypes.string.isRequired
  }

  state = {
    link: this.getLink(this.props.acc)
  };

  componentWillReceiveProps (nextProps) {
    this.updateLink(nextProps.acc);
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

  getLink (acc) {
    const base = this.props.chain === 'morden'
    ? 'https://testnet.etherscan.io/address/'
    : 'https://etherscan.io/address/';
    return base + acc;
  }

  updateLink = (acc) => {
    const link = this.getLink(acc);
    this.setState({ link });
  };

}
