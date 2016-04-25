
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
        <Footer version={status.version} />
      </div>
    );
  }

}
DebugPage.propTypes = {
  status: PropTypes.object.isRequired,
  debug: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DebugPage);

