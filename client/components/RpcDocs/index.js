
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sortBy } from 'lodash';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import AutoComplete from '../AutoComplete';

import { formatRpcMd } from '../../util/rpc-md';
import ScrollTopButton from '../ScrollTopButton';
import style from './style.css';
import Markdown from '../Markdown';
import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = sortBy(rpcData.methods, 'name');

class RpcDocs extends Component {

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
                <AutoComplete
                  floatingLabelText='Method name'
                  className={style.autocomplete}
                  dataSource={rpcMethods.map(m => m.name)}
                  onNewRequest={::this.handleMethodChange}
                  {...this._test('autocomplete')}
                />
                {this.renderData()}
              </div>
            </div>
          </div>
          <ScrollTopButton />
        </main>
      </div>
    );
  }

  renderData () {
    const methods = rpcMethods.map((m, idx) => {
      return (
          <ListItem
            key={m.name}
            disabled
            ref={el => this[`_method-${m.name}`] = el}
          >
            <h3 className={style.headline}>{m.name}</h3>
            <Markdown val={m.desc} />
            <p><strong>Params</strong>{!m.params.length ? ' - none' : ''}</p>
            {m.params.map((p, idx) => <Markdown key={`${m.name}-${idx}`} val={formatRpcMd(p)} />)}
            <p className={style.returnsTitle}><strong>Returns</strong> - </p>
            <Markdown className={style.returnsDesc} val={formatRpcMd(m.returns)} />
            {idx !== rpcMethods.length - 1 ? <hr /> : ''}
          </ListItem>
      );
    });

    return (
      <List>
        {methods}
      </List>
    );
  }

  handleMethodChange (name) {
    ReactDOM.findDOMNode(this[`_method-${name}`]).scrollIntoViewIfNeeded();
  }

}

export default RpcDocs;
