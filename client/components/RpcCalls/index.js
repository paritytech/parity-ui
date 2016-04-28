
import React, { Component, PropTypes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';
import marked from 'marked';

import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import CallIcon from 'material-ui/svg-icons/communication/call';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import InputIcon from 'material-ui/svg-icons/action/input';

import {hasScrollbar} from '../../provider/dom-provider';
import styles from './style.css';
import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = _.sortBy(rpcData.methods, 'name');

export default class RpcCalls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  renderClear () {
    if (!this.props.rpc.prevCalls.length) {
      return;
    }

    return (
      <a
        title='Clear RPC calls history'
        onClick={::this.props.actions.resetRpcPrevCalls}
        className={styles.removeIcon}
        >
        <i className='icon-trash'></i>
      </a>
    );
  }

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className='dapp-content'>
          <div className='dapp-container'>
            <div className='row'>
              <div className='col col-6'>
                <h1><span>RPC</span> Requests</h1>
              </div>
              <div className='col col-6'>
                <RpcNav/>
              </div>
            </div>
          </div>
          <div style={{clear: 'both'}}></div>
          <div className='dapp-container'>
            <div className='row'>
              <div className='col col-6'>
                {this.renderForm()}
              </div>
              <div className='col col-6' onMouseLeave={() => this.setState({hoveredCallIdx: null})}>
                {this.renderClear()}
                <h2 className={styles.header}>History</h2>
                <div className={`${styles.history} row`} id='styles-history'>
                  {this.renderPrevCalls()}
                </div>
                {this.renderPrevCallsToolbar()}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  renderPrevCalls () {
    const {prevCalls} = this.props.rpc;

    if (!prevCalls.length) {
      return (
        <div>
          <h3 className={styles.historyInfo} >
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
          id={`call-${idx}`}
          className={styles.call}
          >
          <span className={styles.callNo}>#{c.callNo}</span>
          <pre>{c.name}({c.params.toString()})</pre>
          <pre className={styles.response}>{this.formatRenderedResponse(c.response)}</pre>
        </div>
      )
    );
  }

  formatRenderedResponse (res) {
    if (_.isArray(res)) {
      return res.map((r, idx) => (
        <span>
          {idx === 0 ? '[' : ','}
          {idx === 0 ? '' : <br />}
          {r}
          {idx === res.length - 1 ? ']' : ''}
        </span>
      ));
    }
    if (_.isPlainObject(res)) {
      const arr = JSON.stringify(res, null, 1);
      return arr.split('\n').map((any, idx) => (
        <span>
          {any}
          {idx !== 0 && idx !== arr.length - 1 ? <br /> : ''}
        </span>
      ));
    }
    return res;
  }

  renderForm () {
    const {selectedMethod} = this.props.rpc;

    return (
      <div>
        <h2 className={styles.header}>
          <label htmlFor='selectedMethod'>
            Call Method
          </label>
        </h2>
        <div className='row'>
          {this.renderMethodList()}
          <h3>Parameters</h3>
          {this.renderInputs()}
          <h3>Returns</h3>
          {this.renderMarkdown(selectedMethod.returns)}
        </div>
        <button
          className={`dapp-block-button ${styles.button}`}
          onClick={() => ::this.onRpcFire() }
          >
          Fire!
        </button>
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcMethods.map(m => m.name);

    const {selectedMethod} = this.props.rpc;
    return (
      <div>
        <AutoComplete
          style={{marginTop: 0}}
          searchText={selectedMethod.name}
          floatingLabelText='Method name'
          dataSource={methods}
          onNewRequest={::this.handleMethodChange}
        />
        <div>
          {this.renderMarkdown(selectedMethod.desc)}
        </div>
      </div>
    );
  }

  renderMarkdown (val) {
    if (!val) {
      return;
    }

    return (
      <div dangerouslySetInnerHTML={{__html: marked(val)}} />
    );
  }

  handleMethodChange (name) {
    let method = rpcMethods.find(m => m.name === name);
    this.props.actions.selectRpcMethod(method);
  }

  onRpcFire (method = this.props.rpc.selectedMethod) {
    const params = method.params.map(p => this.state[`params_${p}`]);
    this.props.actions.fireRpc({
      method: method.name,
      outputFormatter: method.outputFormatter,
      inputFormatters: method.inputFormatters,
      params: params
    });
  }

  setCall (call) {
    let method = _.find(rpcMethods, {name: call.name});
    this.props.actions.selectRpcMethod(method);

    // and set parameter values
    method.params.map((param, idx) => {
      this.setState({
        [`params_${param}`]: call.params[idx]
      });
    });
  }

  setAndCall (call) {
    this.setCall(call);
    let method = _.find(rpcMethods, {name: call.name});
    this.onRpcFire(method);
  }

  renderPrevCallsToolbar () {
    const idx = this.state.hoveredCallIdx;
    if (typeof idx !== 'number') {
      return;
    }
    const call = this.props.rpc.prevCalls[idx];
    const callId = `call-${idx}`;
    const wrapStyle = {top: document.getElementById(callId).offsetTop - 22};
    if (hasScrollbar('styles-history')) {
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
          <IconButton className={styles.callAction} onClick={() => ::this.setAndCall(call)} tooltip='Fire again' tooltipPosition='top-left'>
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

  renderInputs () {
    let {selectedMethod} = this.props.rpc;

    if (!selectedMethod.params || !selectedMethod.params.length) {
      return (
        <span>none</span>
      );
    }

    return _.find(rpcMethods, {name: selectedMethod.name})
            .params.map(
              p => (
                <TextField
                  key={p}
                  inputStyle={{marginTop: 0}}
                  fullWidth
                  hintText={p}
                  hintStyle={{maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap'}}
                  value={this.state[`params_${p}`]}
                  onChange={(evt) => this.setState({
                    [`params_${p}`]: evt.target.value
                  })}
                />
              )
            );
  }

}

RpcCalls.propTypes = {
  rpc: PropTypes.shape({
    prevCalls: PropTypes.array.isRequired,
    selectedMethod: PropTypes.object.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    fireRpc: PropTypes.func.isRequired,
    addToast: PropTypes.func.isRequired,
    selectRpcMethod: PropTypes.func.isRequired,
    resetRpcPrevCalls: PropTypes.func.isRequired
  }).isRequired
};
