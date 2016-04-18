
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Rpc from '../../components/Rpc';
import './style.css';
import * as RpcActions from '../../actions/rpc';

class RpcContainer extends Component {

  render () {
    return (
      <div>
        <Header
          nodeName={this.props.status.name}
          error={this.props.status.error}
        />
        <Rpc {...this.props} />
        <Footer version={this.props.status.version} />
      </div>
    );
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RpcActions, dispatch)
  };
}

RpcContainer.propTypes = {
  status: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RpcContainer);
