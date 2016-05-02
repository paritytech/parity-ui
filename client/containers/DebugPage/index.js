
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateLogging } from '../../actions/logger';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Debug from '../../components/Debug';

class DebugPage extends Component {

  render () {
    const {status} = this.props;

    return (
      <div>
        <Header
          nodeName={status.name}
          disconnected={status.disconnected}
          noOfErrors={status.noOfErrors}
        />
        <Debug {...this.props} />
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
DebugPage.propTypes = {
  status: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  debug: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({updateLogging}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebugPage);

