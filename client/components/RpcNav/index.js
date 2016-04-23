
import React, { Component } from 'react';
import { Link } from 'react-router';
import style from './style.css';

export default class RpcNav extends Component {

  render () {
    return (
      <div className={style.nav}>
        <Link to={'/rpc/calls'} activeClassName={style.activeNav}>
          <i className='icon-call-out'></i>
        </Link>
        <Link to={'/rpc/docs'} activeClassName={style.activeNav}>
          <i className='icon-docs'></i>
        </Link>
      </div>
    );
  }
}
