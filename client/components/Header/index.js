
import {Link} from 'react-router';
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
              <Link to={'/'} activeClassName='active'>
                <i className='icon-globe'></i>
                <span>Status</span>
              </Link>
            </li>
            <li>
              <Link to={'/accounts'} activeClassName='active'>
                <i className='icon-users'></i>
                <span>Accounts</span>
              </Link>
            </li>
            <li>
              <Link to={'/apps'} activeClassName='active'>
                <i className='icon-grid'></i>
                <span>Apps</span>
              </Link>
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

