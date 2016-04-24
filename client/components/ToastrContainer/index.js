
import React, { Component, PropTypes } from 'react';

import styles from './styles.css';

export default class ToastrContainer extends Component {

  render () {
    return (
      <div className={styles.toastrContainer}>
        {::this.renderToasts()}
      </div>
    );
  }

  renderToasts () {
    return this.props.toastr.toasts.map(t => {
      return (
        <div className={styles.toast}>
          {t.message}
        </div>
      );
    });
  }
}

ToastrContainer.propTypes = {
  toastr: PropTypes.shape({
    toasts: PropTypes.array.isRequired
  }).isRequired
};
