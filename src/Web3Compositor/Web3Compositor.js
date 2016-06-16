// no need for react since not using JSX
import React, { Component, PropTypes } from 'react';

export default Wrapped => class Web3Compositor extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  tickActive = false

  render () {
    return (
      <Wrapped { ...this.props } />
    );
  }

  componentDidMount () {
    this.tickActive = true;
    setTimeout(this.next);
  }

  componentWillUnmount () {
    this.tickActive = false;
  }

  next = () => {
    if (!this.tickActive) {
      return;
    }

    this.onTick(() => {
      setTimeout(this.next, 500);
    });
  }

  onTick (next) {
    // can be overridden in subclases
  }

};
