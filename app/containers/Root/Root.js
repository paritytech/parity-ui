import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';

import styles from './Root.css';

// todo [adgo] - add animation wrap children
export default class Root extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render () {
    return (
      <div className={ styles.container }>
        <Header isConnected={ this.props.ws.isConnected } />
        <div className={ styles.mainContainer }>
          { this.props.children }
        </div>
      </div>
    );
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
