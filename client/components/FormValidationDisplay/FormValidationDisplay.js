import React from 'react';

import InvalidIcon from 'material-ui/svg-icons/content/clear';
import ValidIcon from 'material-ui/svg-icons/navigation/check';

import styles from './FormValidationDisplay.css';

export default class FormValidationDisplay extends React.Component {

  render () {
    const { predicate, text, value } = this.props;
    const isValid = predicate(value);
    const isValidClass = isValid ? styles.isValid : '';
    const icon = isValid ? <ValidIcon /> : <InvalidIcon />;
    return (
      <div className={`${styles.container} ${isValidClass}`}>
        { icon } { text }
      </div>
    );
  }

  static propTypes = {
    value: React.PropTypes.any.required,
    predicate: React.PropTypes.any.required,
    text: React.PropTypes.string.required
  }

}
