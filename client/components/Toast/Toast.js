
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
    onClickToast: PropTypes.func,
    onRemoveToast: PropTypes.func
  };

  static defaultProps = {
    onClickToast: () => {}
  };

  render () {
    const { msg, type, className } = this.props;
    return (
      <Paper
        className={ `${styles.container} ${styles[type]} ${className}` }
        zDepth={ 2 }
        onClick={ this.onClickToast }
        >
        { this.renderActions() }
        <span className={ styles.msg }>{ msg }</span>
      </Paper>
    );
  }

  renderActions () {
    if (!this.props.onRemoveToast) {
      return;
    }

    return (
      <IconButton className={ styles.remove } onClick={ this.onRemoveToast }>
        <RemoveIcon />
      </IconButton>
    );
  }

  onRemoveToast = (evt) => {
    evt.stopPropagation();
    const { id, onRemoveToast } = this.props;
    onRemoveToast(id);
  }

  onClickToast = (evt) => {
    const { id, onClickToast } = this.props;
    onClickToast(id);
  }

}
