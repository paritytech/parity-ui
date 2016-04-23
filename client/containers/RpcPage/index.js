
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './style.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as RpcActions from '../../actions/rpc';

class RpcPage extends Component {

  render () {
    return (
      <div>
        <Header
          nodeName={this.props.status.name}
          error={this.props.status.error}
        />
        {this.props.children && React.cloneElement(this.props.children, {
          ...this.props
        })}
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
  status: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RpcPage);
