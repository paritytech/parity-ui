
import React, { Component, PropTypes } from 'react';

import CallsToolbar from '../CallsToolbar';
import { formatRenderedResponse } from '../../provider/dom-provider';
import styles from './style.css';

export default class Calls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  render () {
    let {hoveredCallIdx} = this.state;
    return (
      <div
        className='calls-container'
        onMouseLeave={() => this.setState({hoveredCallIdx: null})}
        {...this._test('calls-container')}
      >
        {this.renderClear()}
        <h2 className={styles.header}>History</h2>
        <div className={`${styles.history} row`} ref={el => this._callsHistory = el}>
          {this.renderCalls()}
        </div>
        <CallsToolbar
          call={this.props.rpc.prevCalls[hoveredCallIdx]}
          callEl={this[`call-${hoveredCallIdx}`]}
          containerEl={this._callsHistory}
          {...this.props}
        />
      </div>
    );
  }

  renderClear () {
    if (!this.props.rpc.prevCalls.length) {
      return;
    }

    return (
      <a
        {...this._test('prev-calls-remove')}
        title='Clear RPC calls history'
        onClick={() => this.props.actions.resetRpcPrevCalls()}
        className={styles.removeIcon}
        >
        <i className='icon-trash'></i>
      </a>
    );
  }

  renderCalls () {
    const {prevCalls} = this.props.rpc;

    if (!prevCalls.length) {
      return (
        <div>
          <h3 className={styles.historyInfo} {...this._test('no-prev-calls')}>
            Fire up some RPC calls and the results will be here.
          </h3>
        </div>
      );
    }
    return prevCalls.map(
      (c, idx) => (
        <div
          key={idx}
          onMouseEnter={() => this.setState({hoveredCallIdx: idx})}
          ref={el => this[`call-${idx}`] = el}
          className={styles.call}
          {...this._test(`prev-call-${c.callNo}`)}
          >
          <span className={styles.callNo}>#{c.callNo}</span>
          <pre>{c.name}({c.params.toString()})</pre>
          <pre className={styles.response}>{formatRenderedResponse(c.response)}</pre>
        </div>
      )
    );
  }

}
