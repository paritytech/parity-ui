import React, { Component, PropTypes } from 'react';

import InvalidIcon from 'material-ui/svg-icons/content/clear';
import ValidIcon from 'material-ui/svg-icons/navigation/check';

import styles from './FormValidationDisplay.css';

export default class FormValidationDisplay extends Component {

  static propTypes = {
    isValid: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }

  render () {
    const { text, isValid } = this.props;
    const isValidClass = isValid ? styles.isValid : '';
    const icon = isValid ? <ValidIcon /> : <InvalidIcon />;
    return (
      <div className={ `${styles.container} ${isValidClass}` }>
        { icon } { text }
      </div>
    );
  }

}
