
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _ from 'underscore';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './style.css'; // eslint-disable-line no-unused-vars
import * as RpcPostmanActions from '../../actions/rpc-postman';
import rpcMethods from './rpc-methods.json';

class Postman extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      selectMethod: rpcMethods.arr[0]
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
        {this.renderMethodList()}
        {this.renderForm()}
        <pre>Response: {this.props.rpcPostman.lastResponse}</pre>
        <Footer version={this.props.status.version} />
      </div>
    );
  }

  renderMethodList () {
    const methods = rpcMethods.arr.map(m =>
      <option key={m.name} value={m.name}>{m.name}</option>
    );

    const handleMethodChange = (evt) => {
      let method = _.findWhere(rpcMethods.arr, {name: evt.target.value});
      this.setState({selectMethod: method});
    };

    return (
      <div>
        <label htmlFor='selectMethod'>Choose Method</label>
        <select id='selectMethod' onChange={handleMethodChange}>
          {methods}
        </select>
      </div>
    );
  }

  renderForm () {
    let {selectMethod} = this.state;
    let inputs;

    if (selectMethod.params) {
      inputs = _.findWhere(rpcMethods.arr, {name: selectMethod.name}).params
                      .map(p => <div>
                        <label>{p}</label><input ref={p} type='text' />
                      </div>);
    }

    const handleRequest = () => {
      const params = selectMethod.params.map(p => this.refs[p].value);
      this.props.actions.fireRpcPostman({
        method: selectMethod.name,
        outputFormatter: selectMethod.outputFormatter,
        inputFormatters: selectMethod.inputFormatters,
        params: params
      });
    };

    return (
      <div>
        {inputs}
        <button className='button' onClick={handleRequest}>Fire!</button>
      </div>
    );
  }

}

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RpcPostmanActions, dispatch)
  };
}

Postman.propTypes = {
  status: PropTypes.object.isRequired,
  rpcPostman: PropTypes.shape({
    lastResponse: PropTypes.any.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    fireRpcPostman: PropTypes.func.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Postman);
