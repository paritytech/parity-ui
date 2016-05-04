import React from 'react';

export class Web3Provider extends React.Component {

  getChildContext () {
    return {
      web3: this.props.web3
    };
  }

  render () {
    return this.props.children;
  }

  static childContextTypes = {
    web3: React.PropTypes.object.isRequired
  };

  static propTypes = {
    web3: React.PropTypes.object.isRequired,
    children: React.PropTypes.element
  };
}
