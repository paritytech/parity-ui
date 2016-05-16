import React, { Component, PropTypes } from 'react';
import AnimateChildren from '../../components-compositors/Animated/children';
import Call from '../Call';
import CallsToolbar from '../CallsToolbar';
import styles from './style.css';

export default class Calls extends Component {

  state = {
    hoveredIdx: null
  }

  render () {
    const { hoveredIdx } = this.state;

    return (
      <div
        className='calls-container'
        onMouseLeave={this.clearHoveredIdx}
        {...this._test('container')}
      >
        {this.renderClear()}
        <h2 className={styles.header}>History</h2>
        <div className={`${styles.history} row`} ref={this.setCallsHistory}>
          {this.renderNoCallsMsg()}
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
        onClick={this.clearHistory}
        className={styles.removeIcon}
        >
        <i className='icon-trash'></i>
      </a>
    );
  }

  renderNoCallsMsg () {
    if (this.props.calls.length) {
      return;
    }

    return (
      <AnimateChildren>
        <div {...this._test('empty-wrapper')}>
          <h3 className={styles.historyInfo} {...this._test('empty')}>
            Fire up some calls and the results will be here.
          </h3>
        </div>
      </AnimateChildren>
    );
  }

  renderCalls () {
    const { calls } = this.props;

    if (!calls.length) {
      return;
    }

    return (
      <AnimateChildren>
        {calls.map((call, idx) => (
          <Call
            key={calls.length - idx}
            callIdx={idx}
            call={call}
            setCallElement={this.setCallElement}
            setHoverIdx={this.setHoveredIdx}
          />
        ))}
      </AnimateChildren>
    );
  }

  clearHoveredIdx = () => {
    this.setState({ hoveredIdx: null });
  }

  setHoveredIdx = (idx) => {
    this.setState({ hoveredIdx: idx });
  }

  setCallsHistory = (el) => {
    this._callsHistory = el;
  }

  clearHistory = () => {
    this.props.reset();
  }

  setCallElement = (idx, el) => {
    this[`call-${idx}`] = el;
  };

  static propTypes = {
    calls: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.shape({
      fireRpc: PropTypes.func.isRequired,
      copyToClipboard: PropTypes.func.isRequired,
      selectRpcMethod: PropTypes.func.isRequired
    }).isRequired,
    reset: PropTypes.func
  }

}
