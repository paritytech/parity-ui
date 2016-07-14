import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Toast from '../Toast';
import styles from './Toasts.css';

export default class Toasts extends Component {

  static propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      msg: PropTypes.string.isRequired
    })).isRequired,
    className: PropTypes.string,
    onClickToast: PropTypes.func,
    onRemoveToast: PropTypes.func
  };

  static defaultProps = {
    onClickToast: () => {}
  };

  render () {
    const { toasts, onClickToast, onRemoveToast } = this.props;
    if (!toasts.length) {
      return null;
    }
    return (
      <div className={ styles.toasts }>
        {
          toasts.map(t => (
            <Toast
              key={ t.id }
              id={ t.id }
              msg={ t.msg }
              type={ t.type }
              onRemoveToast={ onRemoveToast }
              onClickToast={ onClickToast }
            />
          ))
        }
      </div>
    );
  }

}
