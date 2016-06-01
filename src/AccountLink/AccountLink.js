import React, { Component, PropTypes } from 'react';

import styles from './AccountLink.css';

export default class AccountLink extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
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
        className={ `${styles.container} ${className}`}
        >
        { children }
      </a>
    );
  }

  getLink (acc) {
    return `https://etherchain.org/account/${acc}`;
  }

  updateLink = (acc) => {
    const link = this.getLink(acc);
    this.setState({ link });
  };

}
