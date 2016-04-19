
import {Link} from 'react-router';
import React, { Component, PropTypes } from 'react';
import style from './styles.css';

export default class Header extends Component {

  renderError () {
    const {error} = this.props;
    if (!error) {
      return;
    }

    return (
      <nav>
        <ul>
        <li>
          <a className={style.error} disabled title={`${error}`}>
            <i className='icon-power'></i>
            <span>Offline</span>
          </a>
        </li>
        </ul>
      </nav>
    );
  }

  render () {
    return (
      <header className='dapp-header'>
        <hgroup className={style.title}>
          <h1><span>Status</span> <small>Page</small></h1>
          <h2>{this.props.nodeName}</h2>
        </hgroup>
        {this.renderError()}
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
              <Link to={'/debug'} activeClassName='active'>
                <i className='icon-bar-chart'></i>
                <span>Debug</span>
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
  nodeName: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

