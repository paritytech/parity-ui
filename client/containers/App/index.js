
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Status from '../../components/Status';
import * as TodoActions from '../../actions/todos';
import style from './style.css';

class App extends Component {
  render () {
    return (
      <div className={style.normal}>
        <Header nodeName={this.props.status.name} />
        <Status {...this.props} />
        <Footer version={this.props.status.version} />
      </div>
    );
  }
}
App.propTypes = {
  status: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  mining: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
