import React from 'react';

import InvalidIcon from 'material-ui/svg-icons/content/clear';
import ValidIcon from 'material-ui/svg-icons/navigation/check';

import styles from './FormValidationDisplay.css';

export default class FormValidationDisplay extends React.Component {

  render () {
    const { text, isValid } = this.props;
    const isValidClass = isValid ? styles.isValid : '';
    const icon = isValid ? <ValidIcon /> : <InvalidIcon />;
    return (
      <div className={`${styles.container} ${isValidClass}`}>
        { icon } { text }
      </div>
    );
  }

  static propTypes = {
    isValid: React.PropTypes.bool.isRequired,
    text: React.PropTypes.string.isRequired
  }

}
