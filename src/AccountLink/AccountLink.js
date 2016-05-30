import React, { Component, PropTypes } from 'react';

import styles from './AccountLink.css';

export default class AccountLink extends Component {

  link = `https://etherchain.org/account/${this.props.acc}`;

  render () {
    return (
      <a href={ this.link } target='_blank' className={ styles.container }>
        { this.props.children }
      </a>
    );
  }

  static propTypes = {
    children: PropTypes.node,
    acc: PropTypes.string.isRequired
  }
}
