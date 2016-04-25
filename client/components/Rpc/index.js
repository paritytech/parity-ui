
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import marked from 'marked';
import Toggle from 'material-ui/Toggle/Toggle';
import formatJson from 'format-json';

// todo [adgo] 24.04.2016 - remove after merging https://github.com/tomusdrw/eth-node-status-page/pull/46
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({
  palette: {
    textColor: 'e0f7fa'
  }
});
//

import style from './style.css';
import rpcData from '../../data/rpc.json';

const rpcMethods = _.sortBy(rpcData.methods, 'name');

export default class Rpc extends Component {

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
            <h1><span>RPC</span> requests</h1>
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

  renderJsonEditor () {
    if (!this.state.jsonMode) {
      return;
    }

    let method = _.cloneDeep(this.props.rpc.selectedMethod);
    delete method.desc;
    delete method.returns;
    method.params = method.params.map(
      p => this.state[`params_${p}`]
    );

    return (
      <div className='row'>
        <textarea
          className={style.jsonEitor}
          ref={el => this._jsonEditor = el}
          defaultValue={formatJson.plain(method)}
          />
      </div>
    );
  }

  renderPrevCalls () {
    const {prevCalls} = this.props.rpc;

    if (!prevCalls.length) {
      return (
        <div>
          <h3
            className={style.historyInfo}
            >
            Fire up some RPC calls and the results will be here.
          </h3>
        </div>
      );
    }

    return prevCalls.map(
      (c, idx) => (
        <div
          key={idx}
          className={style.call}
          onClick={() => this.onHistoryClick(this.props.rpc.prevCalls[idx])}
          >
          <span className={style.callNo}>#{c.callNo}</span>
          <pre>{c.name}({c.params.toString()})</pre>
          <pre className={style.response}>{c.response}</pre>
        </div>
      )
    );
  }

  renderForm () {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Toggle
            className={style.jsonToggle}
            onToggle={() => this.setState({jsonMode: !this.state.jsonMode})}
            label='JSON'
          />
        </MuiThemeProvider>
        <h2 className={style.header}>
          <label htmlFor='selectedMethod'>
            Call Method
          </label>
        </h2>
        {this.renderJsonEditor()}
        {this.renderFormEditor()}
        <button
          className={`dapp-block-button ${style.button}`}
          onClick={::this.onRpcFire}
          >
          Fire!
        </button>
      </div>
    );
  }

  renderFormEditor () {
    if (this.state.jsonMode) {
      return;
    }

    const {selectedMethod} = this.props.rpc;
    return (
      <div className='row'>
        {this.renderMethodList()}
        <h3>Parameters</h3>
        {this.renderInputs()}
        <h3>Returns</h3>
        {this.renderMarkdown(selectedMethod.returns)}
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcMethods.map(m =>
      <option key={m.name} value={m.name}>{m.name}</option>
    );

    const {selectedMethod} = this.props.rpc;
    return (
      <div>
        <select
          className={style.input}
          id='selectedMethod'
          value={selectedMethod.name}
          onChange={::this.handleMethodChange}
          >
          {methods}
        </select>
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

  handleMethodChange (evt) {
    let method = _.find(rpcMethods, {name: evt.target.value});
    this.props.actions.selectRpcMethod(method);
  }

  onRpcFire () {
    let {selectedMethod} = this.props.rpc;
    let params;

    if (this.state.jsonMode) {
      selectedMethod = JSON.parse(this._jsonEditor.value);
      params = selectedMethod.params;
    } else {
      params = selectedMethod.params.map(p => this.state[`params_${p}`]);
    }

    this.props.actions.fireRpc({
      method: selectedMethod.name,
      outputFormatter: selectedMethod.outputFormatter,
      inputFormatters: selectedMethod.inputFormatters,
      params: params
    });
  }

  onHistoryClick (call) {
    let method = _.find(rpcMethods, {name: call.name});
    this.props.actions.selectRpcMethod(method);
    // and set parameter values
    method.params.map((param, idx) => {
      this.setState({
        [`params_${param}`]: call.params[idx]
      });
    });
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
                <label key={p}>
                  <input
                    className={style.input}
                    placeholder={p}
                    value={this.state[`params_${p}`]}
                    onChange={(evt) => this.setState({
                      [`params_${p}`]: evt.target.value
                    })}
                    />
                </label>
              )
            );
  }

}

Rpc.propTypes = {
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
