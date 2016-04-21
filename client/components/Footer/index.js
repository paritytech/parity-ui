
import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

export default class Footer extends Component {

  render () {
    return (
      <div {...this._testInherit()}>
        <div className={styles.footer}>
          <a href='http://ethcore.io'>ethcore.io</a>
          <span className={styles.right}>
            Powered by: {this.props.version}
          </span>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
};

