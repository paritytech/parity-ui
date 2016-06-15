import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Toastr from '../../../Toastr';
import AnimateChildren from '../../../components-compositors/Animated/children';
import { removeToast } from '../../actions/toastr';
import Header from '../../components/Header';

import styles from './Root.css';

// todo [adgo] - add animation wrap children
class Root extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    toastr: PropTypes.shape({
      toasts: PropTypes.array.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      removeToast: PropTypes.func.isRequired
    }).isRequired
  };

  render () {
    const { location, children, toastr, actions } = this.props;
    return (
      <div className={ styles.container }>
        <Header />
        <AnimateChildren absolute isView pathname={ location.pathname }>
          { children }
        </AnimateChildren>
        <Toastr
          toasts={ toastr.toasts }
          actions={ actions }
        />
      </div>
    );
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ removeToast }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
