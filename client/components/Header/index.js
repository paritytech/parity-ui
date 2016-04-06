
import React, { Component, PropTypes } from 'react';

export default class Header extends Component {
  render () {
    return (
      <header className='dapp-header'>
        <hgroup className='dapp-title'>
          <h1><span>Status</span> <small>Page</small></h1>
          <h2>{this.props.nodeName}</h2>
        </hgroup>
        <div className='dapp-flex-item'></div>
        <nav>
          <ul>
            <li>
              <a href='#' className='active'>
                <i className='icon-globe'></i>
                <span>Status</span>
              </a>
            </li>
            <li>
              <a href='#'>
                <i className='icon-users'></i>
                <span>Accounts</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  nodeName: PropTypes.string.isRequired
};

