import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Toasts from '../Toasts';
import TopBar from '../TopBar';
import TransactionConfirmation from '../TransactionConfirmation';

class Root extends Component {

  static propTypes = {
    isDomReady: PropTypes.bool.isRequired
  }

  render () {
    if (!this.props.isDomReady) {
      return null;
    }
    return (
      <div>
        <TopBar />
        <Toasts />
        <TransactionConfirmation />
      </div>
    );
  }

}

function mapStateToProps (state) {
  return {
    isDomReady: state.dom.isReady
  };
}

export default connect(
  mapStateToProps
)(Root);
