import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ToastrContainer from '../../components/ToastrContainer';
import { removeToast } from '../../actions/toastr';
import Header from '../../components/Header';

import styles from './Root.css';

// todo [adgo] - add animation wrap children
export default class Root extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    ws: PropTypes.shape({
      isConnected: PropTypes.bool.isRequired
    }).isRequired,
    toastr: PropTypes.shape({
      toasts: PropTypes.array.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      removeToast: PropTypes.func.isRequired
    }).isRequired
  };

  render () {
    return (
      <div className={ styles.container }>
        <Header isConnected={ this.props.ws.isConnected } />
        <div className={ styles.mainContainer }>
          { this.props.children }
        </div>
        <ToastrContainer
          toasts={ this.props.toastr.toasts }
          actions={ this.props.actions }
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
