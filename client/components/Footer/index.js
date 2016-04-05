
import React, { Component, PropTypes } from 'react';

export default class extends Component {

  static propTypes = {
    version: PropTypes.string.isRequired,
  }

  render () {
    return (
      <footer className="dapp-content">
        Powered by: {this.props.version}
      </footer>
    );
  }
}

