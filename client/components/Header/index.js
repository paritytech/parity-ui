
import {Link} from 'react-router';
import React, { Component, PropTypes } from 'react';
import style from './styles.css';

export default class Header extends Component {

  renderErrors () {
    const {disconnected} = this.props;
    const isErrors = this.props.noOfErrors > 0;
    if (!disconnected && !isErrors) {
      return;
    }

    return (
      <nav>
        <ul>
        <li className={disconnected ? {} : style.hidden}>
          <a className={style.error} disabled title={`${disconnected}`}>
            <i className='icon-power'></i>
            <span>Offline</span>
          </a>
        </li>
        <li className={isErrors ? {} : style.hidden}>
          <a className={style.warning} disabled title={'You have errors :('}>
            <i className='icon-flag'></i>
            <span>Errors</span>
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
          <h1>Status Page</h1>
          <h3>{this.props.nodeName}</h3>
        </hgroup>
        {this.renderErrors()}
        <div className='dapp-flex-item'></div>
        <nav>
          <ul>
            <li>
              <Link to={'/status'} activeClassName='active' {...this._test('home-link')}>
                <i className='icon-globe'></i>
                <span>Status</span>
              </Link>
            </li>
            <li>
              <Link to={'/rpc'} activeClassName='active' {...this._test('rpc-link')}>
                <i className='icon-call-out'></i>
                <span>Rpc Methods</span>
              </Link>
            </li>
            <li>
              <Link to={'/debug'} activeClassName='active' {...this._test('debug-link')}>
                <i className='icon-bar-chart'></i>
                <span>Debug</span>
              </Link>
            </li>
            <li style={{display: 'none'}}>
              <Link to={'/accounts'} activeClassName='active' {...this._test('accounts-link')}>
                <i className='icon-users'></i>
                <span>Accounts</span>
              </Link>
            </li>
            <li style={{display: 'none'}}>
              <Link to={'/apps'} activeClassName='active' {...this._test('apps-link')}>
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
  noOfErrors: PropTypes.number.isRequired,
  disconnected: PropTypes.bool
};
