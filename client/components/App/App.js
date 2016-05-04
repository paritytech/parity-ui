import React from 'react';

export class App extends React.Component {

  static contextTypes = {
    web3: React.PropTypes.object.isRequired
  };

  render () {
    console.log(this.context.web3);

    return (
      <div>
        <h1>Hello World</h1>
      </div>
    );
  }
}
