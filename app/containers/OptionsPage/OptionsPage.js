import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateToken, updatePort } from '../../actions/ws';
import { updateProxy } from '../../actions/proxy';

import Options from '../../components/Options';

class OptionsPage extends Component {
  render () {
    return (
      <Options { ...this.props } />
    );
  }
}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ updateToken, updatePort, updateProxy } , dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsPage);
