/* global describe, it, beforeEach, expect */

import sinon from 'sinon';
import _ from 'lodash';

import rpcMethods from '../containers/RPC/rpc-methods.json';
import RPCMiddleware from './rpc';
import * as RPCActions from '../actions/rpc';

describe('MIDDLEWARE: RPC', () => {
  let cut;

  beforeEach('mock cut', () => {
    const request = sinon.spy();
    cut = new RPCMiddleware(request);
  });

  it('should invoke request when a modify action is dispatched', () => {
    // given
    const method = 'ethcore_minGasPrice';
    const store = {
      dispatch: sinon.spy()
    };
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const selectedMethod = _.find(rpcMethods.arr, { name: method });
    const params = null;
    const action = RPCActions.fireRPC({
      method: selectedMethod.name,
      outputFormatter: selectedMethod.outputFormatter,
      inputFormatters: selectedMethod.inputFormatters,
      params: params
    });
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    expect(cut._request.calledWith({
      url: '/rpc/',
      method: 'POST',
      json: {
        id: 1000,
        method: method,
        jsonrpc: '2.0',
        params: params // TODO :: add formatting
      }
    })).to.be.true;
  });

  it('should format params according to formatters', () => {

  });
});
