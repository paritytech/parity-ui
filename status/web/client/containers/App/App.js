
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { extend } from 'lodash';

import AnimateChildren from '../../components-compositors/Animated/children';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as ToastActions from '../../actions/toastr';
import { updateLogging } from '../../actions/logger';
import ToastrContainer from '../../components/ToastrContainer';

class AppContainer extends Component {

  render () {
    const { name, disconnected, noOfErrors, version } = this.props.status;

    return (
      <AnimateChildren>
        <div>
          <Header
            nodeName={ name }
            disconnected={ disconnected }
            noOfErrors={ noOfErrors }
            { ...this._test('header') }
          />
          <AnimateChildren absolute isView pathname={ this.props.location.pathname }>
            { this.props.children }
          </AnimateChildren>
          <Footer
            version={ version }
            logging={ this.props.logger.logging }
            updateLogging={ this.props.actions.updateLogging }
            { ...this._test('footer') }
          />
          <ToastrContainer { ...this.props } />
        </div>
      </AnimateChildren>
    );
  }

  static propTypes = {
    children: PropTypes.object.isRequired,
    toastr: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    logger: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(extend({}, ToastActions, { updateLogging }), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
