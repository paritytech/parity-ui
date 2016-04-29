
import React, { Component } from 'react';
import {sortBy} from 'lodash';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import AutoComplete from 'material-ui/AutoComplete';

import ScrollTopButton from '../ScrollTopButton';
import {displayAll} from '../../provider/vendor-provider';
import {el} from '../../provider/dom-provider';
import style from './style.css';
import Markdown from '../Markdown';
import rpcData from '../../data/rpc.json';
import RpcNav from '../RpcNav';

const rpcMethods = sortBy(rpcData.methods, 'name');

export default class RpcDocs extends Component {

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
                {/*<AutoComplete
                  floatingLabelText='Method name'
                  className={style.autocomplete}
                  dataSource={rpcMethods.map(m => m.name)}
                  onNewRequest={::this.handleMethodChange}
                  {...displayAll()}
                  {...this._test('autocomplete')}
                />*/}
                {this.renderData()}
              </div>
            </div>
          </div>
          {/*<ScrollTopButton />*/}
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
            rel={m.name}
          >
            <h3 className={style.headline}>{m.name}</h3>
            <Markdown val={m.desc} />
            <p><strong>Params</strong>{!m.params.length ? ' - none' : ''}</p>
            {m.params.map((p, idx) => <Markdown key={`${m.name}-${idx}`} val={p} />)}
            <p className={style.returnsTitle}><strong>Returns</strong> - </p>
            <Markdown className={style.returnsDesc} val={m.returns} />
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
    el(name).scrollIntoViewIfNeeded();
  }

}
