
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import marked from 'marked';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';

import style from './style.css';
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
        className={style.removeIcon}
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
              <div className='col col-6'>
                {this.renderClear()}
                <h2 className={style.header}>History</h2>
                <div className={`${style.history} row`}>
                  {this.renderPrevCalls()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  renderPrevCalls () {
    const {rpc} = this.props;
    return rpc.prevCalls.map(
      (c, idx) => (
        <div className={style.callWrapper}>
          <div
            key={idx}
            className={style.call}
            >
            <span className={style.callNo}>#{c.callNo}</span>
            <pre>{c.name}({c.params.toString()})</pre>
            <pre className={style.response}>{c.response}</pre>
          </div>
          {this.renderPrevCallsToolbar(rpc.prevCalls[idx])}
        </div>
      )
    );
  }

  renderForm () {
    const {selectedMethod} = this.props.rpc;

    return (
      <div>
        <h2 className={style.header}>
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
          className={`dapp-block-button ${style.button}`}
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

  renderPrevCallsToolbar (call) {
    return (
      <div className={style.prevCallsToolbarWrapper}>
        <div className={style.prevCallsToolbar}>
          <a onClick={() => ::this.setCall(call)}>Set</a>
          <a onClick={() => ::this.setAndCall(call)}>Call Again</a>
          <a onClick={() => ::this.copyCall(call)}>Copy</a>
        </div>
      </div>
    );
  }

  copyCall (call) {
    // todo :: Copy to clipboard!
    // todo :: Notify user!
    console.log(call);
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
    selectRpcMethod: PropTypes.func.isRequired,
    resetRpcPrevCalls: PropTypes.func.isRequired
  }).isRequired
};
