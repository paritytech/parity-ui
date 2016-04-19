
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import rpcData from '../../data/rpc.json';

export default class Rpc extends Component {

  constructor (...args) {
    super(...args);
    this._inputs = {};
  }

  render () {
    return (
      <div>
        <h1>Postman in the house!</h1>
        <div className='row'>
          <div className='col col-3'>
            {this.renderForm()}
          </div>
          <div className='col col-9'>
            {this.renderPrevCalls()}
          </div>
        </div>
      </div>
    );
  }

  renderPrevCalls () {
    let prevCalls = this.props.rpc.prevCalls.map(
      c => <tr><th>{c.name}</th><th>{c.params.toString()}</th><th>{c.response}</th></tr>
    );
    return (
      <div>
        <h2>Call History</h2>
        <table>
          <thead><tr><th>Method</th><th>Params</th><th>Response</th></tr></thead>
          <tbody>{prevCalls}</tbody>
        </table>
      </div>
    );
  }

  renderForm () {
    return (
      <div>
        <label htmlFor='selectedMethod'>Choose Method</label>
        {this.renderMethodList()}
        {this.renderInputs()}
        <input type='submit' onClick={::this.onRpcFire} value='Fire!' />
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcData.methods.map(m =>
      <option key={m.name} value={m.name}>{m.name}</option>
    );

    return (
      <select id='selectedMethod' value={this.props.rpc.selectedMethod.name}
              onChange={::this.handleMethodChange}>
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
    const params = selectedMethod.params.map(p => this._inputs[p.name].value);
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
            .params.map(p =>
                    <div>
                      <div><label>{p}</label></div>
                      <input ref={e => this._inputs[p.name] = e} />
                    </div>);
  }
}

Rpc.propTypes = {
  rpc: PropTypes.shape({
    prevCalls: PropTypes.array.isRequired,
    selectedMethod: PropTypes.object.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    fireRpc: PropTypes.func.isRequired,
    selectRpcMethod: PropTypes.func.isRequired
  }).isRequired
};
