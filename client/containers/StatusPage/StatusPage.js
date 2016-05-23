
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { extend } from 'lodash';
import Status from '../../components/Status';
import * as ModifyMiningActions from '../../actions/modify-mining';
import { updateLogging } from '../../actions/logger';

class StatusPage extends Component {

  render () {
    return <Status {...this.props} />;
  }

  static propTypes = {
    status: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    mining: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(extend({}, ModifyMiningActions, {updateLogging}), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusPage);
