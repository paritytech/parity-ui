import React, { Component } from 'react';
import RpcAutoComplete from './';

export default class RpcAutoCompleteDocs extends Component {

  state = {};

  render () {
    return (
      <div>
        <h2>RPC AutoComplete</h2>
        <RpcAutoComplete onNewRequest={ this.onNewRequest } />
        { this.renderChosenMethod() }
      </div>
    );
  }

  renderChosenMethod () {
    const { method } = this.state;
    if (!method) {
      return <p>Select a method above</p>;
    }

    return <p>You have selected { method }</p>;
  }

  onNewRequest = (method) => {
    this.setState({ method });
  };

}
