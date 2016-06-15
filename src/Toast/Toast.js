
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';

import styles from './Toast.css';

export default class Toast extends Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    onRemoveToast: PropTypes.func
  }

  render () {
    const { msg, type, className } = this.props;
    return (
      <Paper
        className={ `${styles.container} ${styles[type]} ${className}` }
        zDepth={ 2 }
        >
        { this.renderActions() }
        <span className={ styles.msg }>{ msg }</span>
      </Paper>
    );
  }

  renderActions () {
    const { onRemoveToast } = this.props;
    if (!onRemoveToast) {
      return;
    }

    return (
      <IconButton className={ styles.remove } onClick={ onRemoveToast }>
        <RemoveIcon />
      </IconButton>
    );
  }

  onRemoveToast = () => {
    const { id } = this.props;
    this.props.onRemoveToast(id)
  }

}
