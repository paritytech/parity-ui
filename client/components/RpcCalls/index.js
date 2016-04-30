
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import formatJson from 'format-json';

import Toggle from 'material-ui/Toggle/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';

import Calls from '../Calls';
import {displayAll} from '../../provider/vendor-provider';
import Markdown from '../Markdown';
import styles from './style.css';
import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = _.sortBy(rpcData.methods, 'name');

export default class RpcCalls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.rpc.selectedMethod.paramsValues) {
      nextProps.rpc.selectedMethod.params.map((p, idx) => {
        // todo [adgo] 01.05.2016 - make sure this works
        // not sure idx is the same for paramsValues and params
        this.setState({
          [`params_${p}`]: nextProps.rpc.selectedMethod.paramsValues[idx]
        });
      });

      if (this.state.jsonMode) {
        ::this.setJsonEditorValue();
      }
    }
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
              <div className='col col-6 mobile-full'>
                {this.renderForm()}
              </div>
              <div className='col col-6 mobile-full'>
                <Calls {...this.props}  />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  renderForm () {
    return (
      <div>
        <Toggle
          className={styles.jsonToggle}
          onToggle={::this.onJsonToggle}
          label='JSON'
        />
        <h2 className={styles.header}>
          <label htmlFor='selectedMethod'>
            Call Method
          </label>
        </h2>
        {this.renderJsonEditor()}
        {this.renderFormEditor()}
        <button
          {...this._test('fireRpc')}
          className={`dapp-block-button ${styles.button}`}
          onClick={() => ::this.onRpcFire() }
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
        <Markdown val={selectedMethod.returns} />
      </div>
    );
  }

  renderJsonEditor () {
    if (!this.state.jsonMode) {
      return;
    }

    let errorClass = this.state.jsonEditorError ? styles.jsonEditorError : '';

    return (
      <div className='row'>
        <textarea
          onChange={::this.onJsonEditorChange}
          className={`${styles.jsonEditor} ${errorClass}`}
          value={this.state.jsonEditorValue}
          />
          {this.renderJsonEditorError()}
      </div>
    );
  }

  renderJsonEditorError () {
    if (!this.state.jsonEditorError) {
      return;
    }

    return (
      <div className={styles.jsonEditorErrorMsg}>{this.state.jsonEditorError}</div>
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
          {...displayAll()}
          {...this._test('autocomplete')}
        />
        <div>
          <Markdown val={selectedMethod.desc} />
        </div>
      </div>
    );
  }

  handleMethodChange (name) {
    let method = rpcMethods.find(m => m.name === name);
    this.props.actions.selectRpcMethod(method);
  }

  onRpcFire (method = this.props.rpc.selectedMethod) {
    let params;

    if (this.state.jsonMode) {
      try {
        method = JSON.parse(this.state.jsonEditorValue);
      } catch (err) {
        this.props.actions.addToast('error parsing json, check console');
        return console.error('error parsing JSON: ', this.state.jsonEditorValue, err);
      }
      params = method.params;
    } else {
      params = method.params.map(p => this.state[`params_${p}`]);
    }

    this.props.actions.fireRpc({
      method: method.name,
      outputFormatter: method.outputFormatter,
      inputFormatters: method.inputFormatters,
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
                  {...this._test(`params_${p}`)}
                />
              )
            );
  }

  onJsonEditorChange (evt) {
    const {value} = evt.target;

    try {
      JSON.parse(value);
      this.setState({jsonEditorError: null});
    } catch (err) {
      this.setState({jsonEditorError: 'invalid json'});
    }

    this.setState({
      jsonEditorValue: value
    });
  }

  setJsonEditorValue () {
    const {selectedMethod} = this.props.rpc;
    const method = {
      name: selectedMethod.name,
      params: selectedMethod.params.map(p => this.state[`params_${p}`]),
      inputFormatters: selectedMethod.inputFormatters,
      outputFormatter: selectedMethod.outputFormatter
    };
    this.setState({
      jsonEditorValue: formatJson.plain(method)
    });
  }

  onJsonToggle () {
    if (!this.state.jsonMode) {
      this.setJsonEditorValue();
    }
    this.setState({jsonMode: !this.state.jsonMode});
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
