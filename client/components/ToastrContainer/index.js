
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';

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
        <Paper className={styles.toast} zDepth={2} key={t.toastNo}>
          <a className={styles.remove} onClick={() => this.props.actions.removeToast(t.toastNo)}>
            <i className='icon-trash'></i>
          </a>
          {t.message}
        </Paper>
      );
    });
  }

}

ToastrContainer.propTypes = {
  toastr: PropTypes.shape({
    toasts: PropTypes.array.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    removeToast: PropTypes.func.isRequired
  }).isRequired
};
