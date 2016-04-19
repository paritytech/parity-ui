/* global describe, xit, it, beforeEach, expect */

import sinon from 'sinon';
import WebInteractions from './user-web3-interactions';
import * as MiningActions from '../actions/modify-mining';

describe('MIDDLEWARE: WEB3 INTERACTIONS', () => {
  let cut;

  beforeEach('Mock cut', () => {
    const web3 = null;
    const ethcoreWeb3 = {
      setExtraData: sinon.spy()
    };
    cut = new WebInteractions(web3, ethcoreWeb3);
  });

  it('should get correct function names', () => {
    expect(cut.getMethod('modify minGasPrice')).to.equal('setMinGasPrice');
  });

  xit('should not invoke web3 when a non modify action is dispatched', () => {
    // given
    const store = null;
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const action = { type: 'testAction', payload: 'testPayload' };
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    // todo [adgo] 18.04.2016 - remove this. it logs correctly but returns undefined when passed to "expect"
    console.log('**********next**********');
    console.log(next.calledWith(action));
    console.log(typeof next.calledWith(action));
    console.log('**********next**********');
    expect(next.calledWith(action)).to.be.true;
    expect(cut.ethcoreWeb3.notCalled).to.be.true;
  });

  it('should invoke web3 when a modify action is dispatched', () => {
    // given
    const extraData = 'Parity';
    const store = null;
    const next = sinon.spy();
    const middleware = cut.toMiddleware()(store)(next);
    const action = MiningActions.modifyExtraData(extraData);
    expect(middleware).to.be.a('function');
    expect(action).to.be.an('object');

    // when
    middleware(action);

    // then
    expect(
      cut.ethcoreWeb3[cut.getMethod('modify extraData')]
      .calledWith(action.payload)
    ).to.be.true;
    expect(action.type).to.equal('update extraData');
    expect(next.calledWith({
      type: 'update extraData',
      payload: extraData
    })).to.be.true;
  });
});
