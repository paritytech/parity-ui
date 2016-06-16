import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AnimateChildren from '../../../components-compositors/Animated/children';
import Header from '../../components/Header';

import styles from './Root.css';

class Root extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render () {
    const { location, children } = this.props;
    return (
      <div className={ styles.container }>
        <Header />
        <AnimateChildren absolute isView pathname={ location.pathname }>
          { children }
        </AnimateChildren>
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
