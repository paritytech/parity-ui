
import React, { Component, PropTypes } from 'react';

import styles from './styles.css';

export default class Value extends Component {

  render () {
    return (
      <div
        className={styles.inputContainer}
        {...this._testInherit()}
        >
        <input
          className={styles.value}
          type='text'
          value={this.props.value}
          readOnly
          />
        {this.props.children}
      </div>
    );
  }
}

Value.propTypes = {
  value: PropTypes.any,
  children: PropTypes.element
};
