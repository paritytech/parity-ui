/* global describe, it, beforeEach, expect */

import sinon from 'sinon';
import localStore from 'store';

import {syncRpcStateFromLocalStorage} from '../actions/localstorage';
import rpcData from '../data/rpc.json';
import LocalStorageMiddleware from './localstorage';

describe('MIDDLEWARE: LOCAL STORAGE', () => {
  let cut;

  beforeEach('mock cut', () => {
    cut = new LocalStorageMiddleware();
    sinon.spy(cut, 'onAddRpcResponse');
    sinon.spy(cut, 'onInitApp');
    sinon.spy(cut, 'unshift');
  });

  it('should call onAddRpcResponse when respected action is dispatched', () => {
    // given
    const store = null;
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const action = { type: 'add rpcResponse' };
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    expect(cut.onAddRpcResponse.calledWith(store, next, action)).to.be.true;
  });

  it('should call onInitApp when respected action is dispatched', () => {
    // given
    const store = { dispatch: sinon.spy() };
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const action = { type: 'init app' };
    cut.onInitApp = sinon.spy();
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    expect(cut.onInitApp.calledWith(store, next, action)).to.be.true;
  });

  it('should not call onAddRpcResponse or onInitApp when a non-respected action is dispatched', () => {
    // given
    const store = null;
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const action = { type: 'testAction' };
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    expect(cut.onAddRpcResponse.called).to.be.false;
    expect(cut.onInitApp.called).to.be.false;
    expect(next.calledWith(action)).to.be.true;
  });

  describe('RPC', () => {
    it('should dispatch syncRpcStateFromLocalStorage when there are rpc calls in localStorage', () => {
      // given
      const store = { dispatch: sinon.spy() };
      const next = sinon.spy();
      const action = {};
      const key = 'rpcPrevCalls';
      const prevCalls = [rpcData.methods[0]];
      localStore.remove(key);
      localStore.set(key, prevCalls);

      // when
      cut.onInitApp(store, next, action);

      // then
      expect(store.dispatch.calledWith(syncRpcStateFromLocalStorage({
        prevCalls: prevCalls,
        selectedMethod: prevCalls[0]
      }))).to.be.true;
      expect(next.calledWith(action)).to.be.true;
    });

    it('should not dispatch syncRpcStateFromLocalStorage when there are no rpc calls in localStorage', () => {
      // given
      const store = { dispatch: sinon.spy() };
      const next = sinon.spy();
      const action = {};
      localStore.remove('rpcPrevCalls');

      // when
      cut.onInitApp(store, next, action);

      // then
      expect(store.dispatch.notCalled).to.be.true;
      expect(next.calledWith(action)).to.be.true;
    });
  });

  it('should call unshift and next', () => {
    // given
    const store = null;
    const next = sinon.spy();
    const action = { payload: 'testPayload' };

    // when
    cut.onAddRpcResponse(store, next, action);

    // then
    expect(cut.unshift.calledWith('rpcPrevCalls', action.payload)).to.be.true;
    expect(next.calledWith(action)).to.be.true;
  });

  describe('UNSHIFT', () => {
    // TODO [adgo] 20.04.2016 remove if/when PR is accepted: https://github.com/marcuswestin/store.js/pull/153
    it('should create array in local storage by key and unshift item to it', () => {
      // given
      const key = 'foo';
      const val = 'bar';
      localStore.remove(key);

      // when
      cut.unshift(key, val);

      // then
      expect(localStore.get(key)[0]).to.equal(val);
      expect(localStore.get(key).length).to.equal(1);
    });

    // TODO [adgo] 20.04.2016 remove if/when PR is accepted: https://github.com/marcuswestin/store.js/pull/153
    it('should unshift item to an existing array in local storage by key', () => {
      // given
      const key = 'foo';
      const val = 'bar';
      const newVal = 'bazz';
      localStore.remove(key);
      localStore.set(key, [val]);
      expect(localStore.get(key)).to.be.defined;

      // when
      cut.unshift(key, newVal);

      // then
      expect(localStore.get(key)[0]).to.equal(newVal);
      expect(localStore.get(key).length).to.equal(2);
    });
  });
});
