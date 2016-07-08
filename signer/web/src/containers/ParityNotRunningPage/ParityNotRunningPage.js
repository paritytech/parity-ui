import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateAppState } from '../../actions/app';

import ParityNotRunning from '../../components/ParityNotRunning';

class ParityNotRunningPage extends Component {
  render () {
    return (
      <ParityNotRunning { ...this.props } />
    );
  }
}

function mapStateToProps (state) {
  return {
    paritySysuiPath: state.parity.path
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ updateAppState }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParityNotRunningPage);
