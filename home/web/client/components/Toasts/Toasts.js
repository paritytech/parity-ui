import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toast from 'dapps-react-components/src/Toast';
import { removeToast, onClickToast } from 'dapps-react-components/src/actions/toastr';
import styles from './Toasts.css';

class Toasts extends Component {

  static propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      msg: PropTypes.string.isRequired
    })).isRequired,
    onClickToast: PropTypes.func,
    onRemoveToast: PropTypes.func
  };

  render () {
    const { toasts } = this.props;
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
              onRemoveToast={ this.onRemoveToast }
              onClickToast={ this.onClickToast }
            />
          ))
        }
      </div>
    );
  }

  onClickToast () {
    this.props.onClickToast();
  }

  onRemoveToast () {
    this.props.onRemoveToast();
  }

}

function mapStateToProps (state) {
  return {
    toasts: state.toastr.toasts
  };
}

function bindDispatchToProps (dispatch) {
  return bindActionCreators({
    onRemoveToast: removeToast,
    onClickToast
  }, dispatch);
}

export default connect(
  mapStateToProps,
  bindDispatchToProps
)(Toasts);
