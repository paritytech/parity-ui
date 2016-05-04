/* global describe, it, beforeEach, afterEach, expect */

import sinon from 'sinon';
import * as ErrorUtil from './error';

describe('UTIL - ERROR', () => {
  beforeEach('spy on isError', () => {
    sinon.spy(ErrorUtil, 'isError');
  });

  afterEach('spy on isError', () => {
    ErrorUtil.isError.restore();
  });

  describe('HAS ERRORS', () => {
    it('should return undefined and not invoke isError when null is passed', () => {
      // given
      const xs = null;

      // when
      const res = ErrorUtil.hasErrors(xs);

      // then
      expect(ErrorUtil.isError.called).to.be.false;
      expect(res).to.be.undefined;
    });

    it('should return true and invoke isError when at least one error object is passed', () => {
      // given
      const arg1 = 'test string';
      const arg2 = new Error();
      const xs = [arg1, arg2];

      // when
      const res = ErrorUtil.hasErrors(xs);

      // then
      // todo [adgo] - 30.04.2016 - fix and uncomment
      // expect(ErrorUtil.isError.calledWith(arg1)).to.be.true;
      // expect(ErrorUtil.isError.calledWith(arg2)).to.be.true;
      expect(res).to.be.true;
    });

    it('should return false and invoke isError when non error objects are passed', () => {
      // given
      const arg1 = 'test string';
      const arg2 = 123;
      const xs = [arg1, arg2];

      // when
      const res = ErrorUtil.hasErrors(xs);

      // then
      // todo [adgo] - 30.04.2016 - fix and uncomment
      // expect(ErrorUtil.isError.calledWith(arg1)).to.be.true;
      // expect(ErrorUtil.isError.calledWith(arg2)).to.be.true;
      expect(res).to.be.false;
    });
  });

  describe('IS ERROR', () => {
    it('should return false when non error object is passed', () => {
      // given
      const arg = '';

      // when
      const res = ErrorUtil.isError(arg);

      // then
      expect(res).to.be.false;
    });

    it('should return true when error object is passed', () => {
      // given
      const arg = new Error();

      // when
      const res = ErrorUtil.isError(arg);

      // then
      expect(res).to.be.true;
    });
  });
});
