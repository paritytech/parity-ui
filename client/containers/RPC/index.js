
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _ from 'lodash';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.css';
import * as RPCActions from '../../actions/rpc';
import rpcMethods from './rpc-methods.json';

class RPC extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      selectedMethod: rpcMethods.arr[0]
    };
  }

  render () {
    return (
      <div>
        <Header
          nodeName={this.props.status.name}
          error={this.props.status.error}
        />
        <h1>Postman in the house!</h1>
        {this.renderPrevCalls()}
        {this.renderMethodList()}
        {this.renderForm()}
        <Footer version={this.props.status.version} />
      </div>
    );
  }

  renderPrevCalls () {
    let prevCalls = this.props.rpc.prevCalls.map(
      c => <tr><th>{c.name}</th><th>{c.params.toString()}</th><th>{c.response}</th></tr>
    );
    return (
      <div>
        <h2>History</h2>
        <table>
          <thead><tr><th>Method</th><th>Params</th><th>Response</th></tr></thead>
          <tbody>{prevCalls}</tbody>
        </table>
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcMethods.arr.map(m =>
      <option key={m.name} value={m.name}>{m.name}</option>
    );

    return (
      <div>
        <label htmlFor='selectedMethod'>Choose Method</label>
        <select id='selectedMethod' onChange={::this.handleMethodChange}>
          {methods}
        </select>
      </div>
    );
  }

  handleMethodChange (evt) {
    let method = _.find(rpcMethods.arr, {name: evt.target.value});
    this.setState({selectedMethod: method});
  }

  renderForm () {
    return (
      <div>
        {this.renderInputs()}
        <button className='button' onClick={::this.onRpcFire}>Fire!</button>
      </div>
    );
  }

  onRpcFire () {
    let {selectedMethod} = this.state;
    const params = selectedMethod.params.map(p => this.refs[p].value);
    this.props.actions.fireRPC({
      method: selectedMethod.name,
      outputFormatter: selectedMethod.outputFormatter,
      inputFormatters: selectedMethod.inputFormatters,
      params: params
    });
  }

  renderInputs () {
    let {selectedMethod} = this.state;
    if (!selectedMethod.params) {
      return;
    }
    return _.find(rpcMethods.arr, {name: selectedMethod.name})
            .params.map(p =>
                    <div>
                      <label>{p}</label><input ref={p} />
                    </div>);
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RPCActions, dispatch)
  };
}

RPC.propTypes = {
  status: PropTypes.object.isRequired,
  rpc: PropTypes.shape({
    prevCalls: PropTypes.array.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    fireRPC: PropTypes.func.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RPC);
