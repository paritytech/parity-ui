
import React, { Component } from 'react';
import { Link } from 'react-router';
import style from './style.css';

export default class RpcNav extends Component {

  render () {
    return (
      <div className={style.nav}>
        <Link to={'/rpc/calls'} activeClassName={style.activeNav} {...this._test('rpc-calls-link')}>
          <i className='icon-call-out'></i>
        </Link>
        <Link to={'/rpc/docs'} activeClassName={style.activeNav} {...this._test('rpc-docs-link')}>
          <i className='icon-docs'></i>
        </Link>
      </div>
    );
  }
}
