
import React, { Component, PropTypes } from 'react';

export default class Web3Component extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  componentDidMount () {
    this.setState({
      tickActive: true
    });

    setTimeout(this.next);
  }

  componentWillUnmount () {
    this.setState({
      tickActive: false
    });
  }

  next = () => {
    if (!this.state.tickActive) {
      return;
    }

    this.onTick(() => {
      setTimeout(this.next, 500);
    });
  }

  onTick (next) {
    // can be overridden in subclases
  }

}
