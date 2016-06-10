import React, { Component, PropTypes } from 'react';

import style from './Root.css';

// todo [adgo] - add animation wrap children
export default class Root extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render () {
    return (
      <div className={ style.container }>
        { this.props.children }
      </div>
    );
  }

}
