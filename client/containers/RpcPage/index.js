
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import './style.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as RpcActions from '../../actions/rpc';
import { updateLogging } from '../../actions/logger';
import { copyToClipboard } from '../../actions/clipboard';

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
        {this.props.children && React.cloneElement(this.props.children, {
          ...this.props
        })}
        <Footer
          version={status.version}
          logging={this.props.logger.logging}
          updateLogging={this.props.actions.updateLogging}
          {...this._test('footer')}
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
    actions: bindActionCreators(_.extend({}, RpcActions, {copyToClipboard}, {updateLogging}), dispatch)
  };
}

RpcPage.propTypes = {
  status: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RpcPage);
