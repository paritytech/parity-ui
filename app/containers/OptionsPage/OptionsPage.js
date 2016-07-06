import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateToken, updateWsPath } from '../../actions/ws';
import { updateProxy } from '../../actions/proxy';

import Options from '../../components/Options';

class OptionsPage extends Component {
  render () {
    return (
      <div>
        <Options { ...this.props } />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ updateToken, updateWsPath, updateProxy }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsPage);
