
import React, { Component, PropTypes } from 'react';

export default class extends Component {

  static propTypes = {
    nodeName: PropTypes.string.isRequired
  }

  render () {
    return (
      <header className="dapp-header">
        <hgroup className="dapp-title">
          <h1><span>Status</span> <small>Page</small></h1>
          <h2>{this.props.nodeName}</h2>
        </hgroup>
      </header>
    );
  }
}

