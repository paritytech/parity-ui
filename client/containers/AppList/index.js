
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './style.css';

class AppList extends Component {
  render () {
    return (
      <div className={style.normal}>
        <Header nodeName={this.props.status.name} />
        <h1>List of installed apps</h1>
        <Footer version={this.props.status.version} />
      </div>
    );
  }
}
AppList.propTypes = {
  status: PropTypes.object.isRequired
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
)(AppList);
