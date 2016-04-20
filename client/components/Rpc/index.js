
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import marked from 'marked';

import style from './style.css';
import rpcData from '../../data/rpc.json';

export default class Rpc extends Component {

  constructor (...args) {
    super(...args);
    this._inputs = {};
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

  renderPrevCalls () {
    return this.props.rpc.prevCalls.map(
      (c, idx) => (
        <div key={idx} className={style.call}>
          <span className={style.callNo}>#{c.callNo}</span>
          <pre>{c.name}({c.params.toString()})</pre>
          <pre>{c.response}</pre>
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
          <div dangerouslySetInnerHTML={{__html: marked(selectedMethod.returns)}} />
        </div>
        <button
          className={`dapp-block-button ${style.button}`}
          onClick={::this.onRpcFire}
          >
          Fire!
        </button>
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcData.methods.map(m =>
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
          {this.renderDescription(selectedMethod)}
        </div>
      </div>
    );
  }

  renderDescription (selectedMethod) {
    if (!selectedMethod.desc) {
      return;
    }

    return (
      <div dangerouslySetInnerHTML={{__html: marked(selectedMethod.desc)}} />
    );
  }

  handleMethodChange (evt) {
    let method = _.find(rpcData.methods, {name: evt.target.value});
    this.props.actions.selectRpcMethod(method);
  }

  onRpcFire () {
    let {selectedMethod} = this.props.rpc;
    const params = selectedMethod.params.map(p => this._inputs[p].value);
    this.props.actions.fireRpc({
      method: selectedMethod.name,
      outputFormatter: selectedMethod.outputFormatter,
      inputFormatters: selectedMethod.inputFormatters,
      params: params
    });
  }

  renderInputs () {
    let {selectedMethod} = this.props.rpc;

    if (!selectedMethod.params || !selectedMethod.params.length) {
      return (
        <span>none</span>
      );
    }

    return _.find(rpcData.methods, {name: selectedMethod.name})
            .params.map(
              p => (
                <label>
                  <input
                    className={style.input}
                    placeholder={p}
                    ref={e => this._inputs[p] = e}
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
