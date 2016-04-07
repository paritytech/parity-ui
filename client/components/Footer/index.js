
import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

export default class Footer extends Component {

  render () {
    return (
      <div className={styles.footer}>
        Powered by: {this.props.version}
      </div>
    );
  }
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
};

