
import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { sortBy, find, extend } from 'lodash';

import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import CallIcon from 'material-ui/svg-icons/communication/call';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import InputIcon from 'material-ui/svg-icons/action/input';

import { hasScrollbar, formatRenderedResponse } from '../../provider/dom-provider';
import styles from './style.css';
import rpcData from '../../data/rpc.json';
const rpcMethods = sortBy(rpcData.methods, 'name');

export default class Calls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  render () {
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
        {this.renderCallsToolbar()}
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

  setCall (call) {
    let method = find(rpcMethods, {name: call.name});
    this.props.actions.selectRpcMethod(extend({}, method, {paramsValues: call.params}));
  }

  makeCall (call) {
    this.setCall(call);
    let method = find(rpcMethods, {name: call.name});
    this.props.actions.fireRpc({
      method: method.name,
      outputFormatter: method.outputFormatter,
      inputFormatters: method.inputFormatters,
      params: call.params
    });
  }

  renderCallsToolbar () {
    const idx = this.state.hoveredCallIdx;
    if (typeof idx !== 'number') {
      return;
    }
    const call = this.props.rpc.prevCalls[idx];
    const callEl = this[`call-${idx}`];
    const wrapStyle = {top: callEl.offsetTop - 22 - this._callsHistory.scrollTop};
    if (hasScrollbar(this._callsHistory)) {
      wrapStyle.right = 13;
    }

    return (
      <div
        className={styles.callActionsWrap}
        style={wrapStyle}
        >
        <IconButton className={styles.callActionsButton}><MoreHorizIcon /></IconButton>
        <div className={styles.callActions}>
          <IconButton className={styles.callAction} onClick={() => ::this.setCall(call)} tooltip='Set' tooltipPosition='top-left'>
            <InputIcon className={styles.callActionIcon} />
          </IconButton>
          <IconButton className={styles.callAction} onClick={() => ::this.makeCall(call)} tooltip='Fire again' tooltipPosition='top-left'>
            <CallIcon className={styles.callActionIcon} />
          </IconButton>
          <CopyToClipboard
            text={JSON.stringify(call)}
            onCopy={() => this.props.actions.addToast('Method copied to clipboard!')}
            >
            <IconButton className={styles.callAction} tooltip='Copy to clipboard' tooltipPosition='top-left'>
              <AssignmentIcon className={styles.callActionIcon}/>
            </IconButton>
          </CopyToClipboard>
        </div>
      </div>
    );
  }

}
