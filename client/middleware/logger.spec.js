/* global describe, it, beforeEach, afterEach, expect */

import sinon from 'sinon';
import logger, { formatPayload } from './logger';

describe('MIDDLEWARE: LOGGER', () => {
  describe('MIDDLEWARE', () => {
    const state = { logger: { logging: true } };

    beforeEach('spy console', () => {
      sinon.spy(console, 'log');
      sinon.spy(console, 'error');
    });

    afterEach('unspy console', () => {
      console.log.restore();
      console.error.restore();
    });

    it('should call console.log on non-error msgs', () => {
      // given
      const store = { getState: () => state };
      const next = sinon.spy();
      const action = {type: 'test action'};
      const middleware = logger(store)(next);
      expect(middleware).to.be.a('function');
      expect(action).to.be.an('object');

      // when
      middleware(action);

      // then
      expect(console.error.called).to.be.false;
      expect(console.log.calledOnce).to.be.true;
    });

    it('should call console.log on non-error msgs', () => {
      // given
      const store = { getState: () => state };
      const next = sinon.spy();
      const action = {type: 'test error action'};
      const middleware = logger(store)(next);
      expect(middleware).to.be.a('function');
      expect(action).to.be.an('object');

      // when
      middleware(action);

      // then
      expect(console.log.called).to.be.false;
      expect(console.error.calledOnce).to.be.true;
    });
  });

  describe('FORMAT', () => {
    it('should return number when number is passed', () => {
      // given
      const payload = 123;

      // when
      const res = formatPayload(payload);

      // then
      expect(res).to.equal(payload);
    });

    it('should return boolean when boolean is passed', () => {
      // given
      const payload = true;

      // when
      const res = formatPayload(payload);

      // then
      expect(res).to.equal(payload);
    });

    // [adgo] 30.04.2016 - spying on JSON.stringify didn't work
    // so I'm manually testing the values returned
    it('should return stringified array when array is passed', () => {
      // given
      const payload = ['foo', true];

      // when
      const res = formatPayload(payload);

      // then
      expect(res).to.equal('["foo",true]');
    });

    // [adgo] 30.04.2016 - spying on JSON.stringify didn't work
    // so I'm manually testing the values returned
    it('should return stringified array when array is passed', () => {
      // given
      const payload = {foo: true, bar: 'not so true'};

      // when
      const res = formatPayload(payload);

      // then
      expect(res).to.equal('{"foo":true,"bar":"not so true"}');
    });
  });
});
