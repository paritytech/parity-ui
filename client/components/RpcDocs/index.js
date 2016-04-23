
import React, { Component, PropTypes } from 'react';
import {sortBy} from 'lodash';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {MakeSelectable} from 'material-ui/List/MakeSelectable';
let SelectableList = MakeSelectable(List);

import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = sortBy(rpcData.methods, 'name');

export default class RpcDocs extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      selected: this.props.rpc.selectedDoc
    };
  }

  componentDidMount () {
    const id = `doc-${this.props.rpc.selectedDoc}`;
    document.getElementById(id).scrollIntoViewIfNeeded();
  }

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className='dapp-content'>
          <div className='dapp-container'>
            <div className='row'>
              <div className='col col-6'>
                <h1><span>RPC</span> Docs</h1>
              </div>
              <div className='col col-6'>
                <RpcNav/>
              </div>
            </div>
          </div>
          <div style={{clear: 'both'}}></div>
          <div className='dapp-container'>
            <div className='row'>
              <div className='col col-12'>

                {this.renderData()}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  renderData () {
    const methods = rpcMethods.map((m, idx) => {
      return (
          <ListItem
            key={m.name}
            id={`doc-${m.name}`}
            value={m.name}
            primaryTogglesNestedList
            autoGenerateNestedIndicator={false}
            primaryText={m.name}
            initiallyOpen={m.name === this.props.rpc.selectedDoc}
            onNestedListToggle={() => ::this.handleToggle(idx)}
            nestedItems={[
              <p key={`${m.name} 1`}>{m.desc}</p>,
              <p key={`${m.name} 2`}><strong>Params - </strong>{m.params.length ? m.params : 'none'}</p>,
              <p key={`${m.name} 3`}><strong>Returns - </strong>{m.returns}</p>,
              <hr />
            ]}
          />
      );
    });

    return (
      <SelectableList
      onChange={() => {}}
      value={this.state.selected}
        >
        {methods}
      </SelectableList>
    );
  }

  handleToggle (idx) {
    const {name} = rpcMethods[idx];
    if (name === this.props.rpc.selectedDoc) {
      return;
    }

    this.setState({selected: name});

    this.props.actions.selectRpcDoc(name);
  }

}

RpcDocs.PropTypes = {
  rpc: PropTypes.shape({
    selectedDoc: PropTypes.string.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    selectRpcDoc: PropTypes.func.isRequired
  }).isRequired
};
