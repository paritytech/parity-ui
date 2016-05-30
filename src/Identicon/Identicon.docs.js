import React, { Component } from 'react';
import Identicon from './';

const seed = '0xe6378318641F99c2B6624700B3f342D1c6E84852';

export default class IdenticonDocs extends Component {
  render () {
    return (
      <div>
        <h1>Identicon</h1>
        <Identicon seed={ seed } />
      </div>
    );
  }
}
