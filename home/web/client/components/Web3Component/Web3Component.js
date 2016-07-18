
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

  next () {
    if (!this.state.tickActive) {
      return;
    }

    this.onTick(mod => {
      mod = mod || 1;
      setTimeout(::this.next, 1000 * mod);
    });
  }

  onTick (next) {
    // can be overridden in subclases
  }

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };

}
