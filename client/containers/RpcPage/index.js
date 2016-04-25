
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Rpc from '../../components/Rpc';
import './style.css';
import * as RpcActions from '../../actions/rpc';

class RpcPage extends Component {

  render () {
    const {status} = this.props;
    return (
      <div>
        <Header
          nodeName={status.name}
          disconnected={status.disconnected}
          noOfErrors={status.noOfErrors}
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

RpcPage.propTypes = {
  status: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RpcPage);
