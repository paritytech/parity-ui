
import React, { Component, PropTypes } from 'react';

import CallsToolbar from '../CallsToolbar';
import Response from '../Response';
import styles from './style.css';

export default class Calls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  render () {
    let {hoveredIdx} = this.state;
    return (
      <div
        className='calls-container'
        onMouseLeave={() => this.setState({hoveredIdx: null})}
        {...this._test('container')}
      >
        {this.renderClear()}
        <h2 className={styles.header}>History</h2>
        <div className={`${styles.history} row`} ref={el => this._callsHistory = el}>
          {this.renderCalls()}
        </div>
        <CallsToolbar
          call={this.props.calls[hoveredIdx]}
          callEl={this[`call-${hoveredIdx}`]}
          containerEl={this._callsHistory}
          actions={this.props.actions}
        />
      </div>
    );
  }

  renderClear () {
    if (!this.props.calls.length) {
      return;
    }

    return (
      <a
        {...this._test('remove')}
        title='Clear RPC calls history'
        onClick={() => this.props.reset()}
        className={styles.removeIcon}
        >
        <i className='icon-trash'></i>
      </a>
    );
  }

  renderCalls () {
    const {calls} = this.props;

    if (!calls.length) {
      return (
        <div>
          <h3 className={styles.historyInfo} {...this._test('empty')}>
            Fire up some calls and the results will be here.
          </h3>
        </div>
      );
    }
    return calls.map(
      (c, idx) => (
        <div
          key={idx}
          onMouseEnter={() => this.setState({hoveredIdx: idx})}
          ref={el => this[`call-${idx}`] = el}
          className={styles.call}
          {...this._test(`call-${c.callNo}`)}
          >
          <span className={styles.callNo}>#{c.callNo}</span>
          <pre>{c.name}({c.params.toString()})</pre>
          <Response response={c.response} />
        </div>
      )
    );
  }

}

Calls.propTypes = {
  calls: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.shape({
    fireRpc: PropTypes.func.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    selectRpcMethod: PropTypes.func.isRequired
  }).isRequired,
  reset: PropTypes.func
};
