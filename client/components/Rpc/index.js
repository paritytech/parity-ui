
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import style from './style.css';
import rpcData from '../../data/rpc.json';

export default class Rpc extends Component {

  constructor (...args) {
    super(...args);
    this._inputs = {};
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
                <a
                  title='Clear RPC calls history'
                  onClick={::this.props.actions.resetRpcPrevCalls}
                  className={style.right}
                  >
                  <i className='icon-trash'></i>
                </a>
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
    return (
      <div>
        <h2 className={style.header}>
          <label htmlFor='selectedMethod'>
            Call Method
          </label>
        </h2>
        <div className='row'>
          {this.renderMethodList()}
          {this.renderInputs()}
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

    return (
      <select
        className={style.input}
        id='selectedMethod'
        value={this.props.rpc.selectedMethod.name}
        onChange={::this.handleMethodChange}
        >
        {methods}
      </select>
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
    if (!selectedMethod.params) {
      return;
    }

    return _.find(rpcData.methods, {name: selectedMethod.name})
            .params.map(
              p => (
                <div>
                  <label>
                    <input
                      className={style.input}
                      placeholder={p}
                      ref={e => this._inputs[p] = e}
                      />
                  </label>
                </div>
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
