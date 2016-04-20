
import React, { Component, PropTypes } from 'react';

import styles from './styles.css';

export default class Value extends Component {

  constructor (...args) {
    super(...args);
  }

  render () {
    return (
      <input
        className={styles.value}
        type='text'
        value={this.props.value}
        readOnly
        />
    );
  }
}

Value.propTypes = {
  value: PropTypes.any
};
