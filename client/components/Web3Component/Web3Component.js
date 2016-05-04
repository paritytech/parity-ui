
import React from 'react';

export class Web3Component extends React.Component {

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

    this.onTick(() => {
      setTimeout(::this.next, 500);
    });
  }

  onTick (next) {
    // can be overridden in subclases
  }

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };

}
