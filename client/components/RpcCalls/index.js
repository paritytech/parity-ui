
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import Toggle from 'material-ui/Toggle/Toggle';
import AutoComplete from '../AutoComplete';
import TextField from 'material-ui/TextField';

import Animated from '../../components-compositors/Animated';
import AnimateChildren from '../../components-compositors/Animated/children';
import JsonEditor from '../JsonEditor';
import Calls from '../Calls';
import Markdown from '../Markdown';
import styles from './style.css';
import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = _.sortBy(rpcData.methods, 'name');

class RpcCalls extends Component {

  constructor (...args) {
    super(...args);
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    const { selectedMethod } = nextProps.rpc;
    if (selectedMethod.paramsValues) {
      selectedMethod.params.map((p, idx) => {
        // todo [adgo] 01.05.2016 - make sure this works
        // not sure idx is the same for paramsValues and params
        this.setState({
          [this.paramKey(p)]: selectedMethod.paramsValues[idx]
        });
      });

      if (this.state.jsonMode) {
        this.setJsonEditorValue();
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
                <Calls
                  calls={this.props.rpc.prevCalls}
                  reset={this.props.actions.resetRpcPrevCalls}
                  actions={this.props.actions}
                />
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
        <AnimateChildren absolute>
          {this.renderJsonForm()}
          {this.renderInputForm()}
        </AnimateChildren>
      </div>
    );
  }

  renderInputForm () {
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
        {this.renderFormButton()}
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
          {...this._test('autocomplete')}
        />
        <div>
          <Markdown val={selectedMethod.desc} />
        </div>
      </div>
    );
  }

  handleMethodChange (name) {
    const method = rpcMethods.find(m => m.name === name);
    this.props.actions.selectRpcMethod(method);
  }

  onRpcFire () {
    if (this.state.jsonMode) {
      return this.onCustomRpcFire();
    }

    const { selectedMethod } = this.props.rpc;
    let params = selectedMethod.params.map(::this.paramValue);

    this.props.actions.fireRpc({
      method: selectedMethod.name,
      outputFormatter: selectedMethod.outputFormatter,
      inputFormatters: selectedMethod.inputFormatters,
      params
    });
  }

  onCustomRpcFire () {
    const { method, params } = this.state.jsonEditorParsedValue;
    this.props.actions.fireRpc({ method, params });
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
                  value={this.paramValue(p)}
                  onChange={(evt) => this.setState({
                    [this.paramKey(p)]: evt.target.value
                  })}
                  {...this._test(this.paramKey(p))}
                />
              )
            );
  }

  setJsonEditorValue () {
    const {selectedMethod} = this.props.rpc;
    const json = {
      method: selectedMethod.name,
      params: selectedMethod.params.map(::this.paramValue)
    };
    this.setState({
      jsonEditorValue: json
    });
  }

  onJsonToggle () {
    if (!this.state.jsonMode) {
      this.setJsonEditorValue();
    }
    this.setState({jsonMode: !this.state.jsonMode});
  }

  renderJsonForm () {
    if (!this.state.jsonMode) {
      return;
    }

    return (
      <div>
        <JsonEditor
          onChange={::this.onJsonEditorChange}
          value={this.state.jsonEditorValue}
        />
        {this.renderFormButton()}
      </div>
    );
  }

  renderFormButton () {
    return (
      <button
        {...this._test('fireRpc')}
        className={`dapp-block-button`}
        disabled={this.state.jsonEditorError}
        onClick={::this.onRpcFire}
        >
        Fire!
      </button>
    );
  }

  onJsonEditorChange (jsonEditorParsedValue, jsonEditorError) {
    this.setState({
      jsonEditorParsedValue,
      jsonEditorError
    });
  }

  paramValue (p) {
    return this.state[this.paramKey(p)];
  }

  paramKey (p) {
    return `params_${p}`;
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

export default Animated(RpcCalls);
