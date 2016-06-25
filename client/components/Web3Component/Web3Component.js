
import React from 'react';

export default class Web3Component extends React.Component {

  componentDidMount () {
    this.setState({
      tickActive: true
    });

    setTimeout(::this.next);
  }

  componentWillUnmount () {
    this.setState({
      tickActive: false
    });
  }

  next (mod) {
    if (!this.state.tickActive) {
      return;
    }

    mod = mod || 1;
    this.onTick(() => {
      setTimeout(::this.next, 1250 * mod);
    });
  }

  onTick (next) {
    // can be overridden in subclases
  }

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };

}
