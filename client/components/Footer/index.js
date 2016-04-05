
import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {

  render () {
    return (
      <footer className='dapp-content'>
        Powered by: {this.props.version}
      </footer>
    );
  }
}

Footer.propTypes = {
  version: PropTypes.string.isRequired
};

