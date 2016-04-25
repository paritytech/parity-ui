
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ToastActions from '../../actions/toastr';
import ToastrContainer from '../../components/ToastrContainer';

class AppContainer extends Component {

  render () {
    return (
      <div>
        {this.props.children}
        <ToastrContainer {...this.props} />
      </div>
    );
  }

}

AppContainer.propTypes = {
  children: PropTypes.object.isRequired,
  toastr: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ToastActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
