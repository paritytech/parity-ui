/* global describe, it, beforeEach, afterEach, expect */

import sinon from 'sinon';
import * as ErrorProvider from './error-provider';

describe('PROVIDER - ERROR', () => {
  beforeEach('spy on isError', () => {
    sinon.spy(ErrorProvider, 'isError');
    sinon.spy(ErrorProvider, 'toastError');
  });

  afterEach('spy on isError', () => {
    ErrorProvider.isError.restore();
    ErrorProvider.toastError.restore();
  });

  describe('HAS ERRORS', () => {
    it('should return undefined and not invoke isError when null is passed', () => {
      // given
      const xs = null;

      // when
      const res = ErrorProvider.hasErrors(xs);

      // then
      expect(ErrorProvider.isError.called).to.be.false;
      expect(res).to.be.undefined;
    });

    it('should return true and invoke isError when at least one error object is passed', () => {
      // given
      const arg1 = 'test string';
      const arg2 = new Error();
      const xs = [arg1, arg2];

      // when
      const res = ErrorProvider.hasErrors(xs);

      // then
      // todo [adgo] - 30.04.2016 - fix and uncomment
      // expect(ErrorProvider.isError.calledWith(arg1)).to.be.true;
      // expect(ErrorProvider.isError.calledWith(arg2)).to.be.true;
      expect(res).to.be.true;
    });

    it('should return false and invoke isError when non error objects are passed', () => {
      // given
      const arg1 = 'test string';
      const arg2 = 123;
      const xs = [arg1, arg2];

      // when
      const res = ErrorProvider.hasErrors(xs);

      // then
      // todo [adgo] - 30.04.2016 - fix and uncomment
      // expect(ErrorProvider.isError.calledWith(arg1)).to.be.true;
      // expect(ErrorProvider.isError.calledWith(arg2)).to.be.true;
      expect(res).to.be.false;
    });
  });

  describe('IS ERROR', () => {
    it('should return false when non error object is passed', () => {
      // given
      const arg = '';

      // when
      const res = ErrorProvider.isError(arg);

      // then
      expect(res).to.be.false;
    });

    it('should return true when error object is passed', () => {
      // given
      const arg = new Error();

      // when
      const res = ErrorProvider.isError(arg);

      // then
      expect(res).to.be.true;
    });
  });

  describe('TOAST ERRORS', () => {
    it('should call TOAST ERROR once when one error object is passed', () => {
      // given
      const arg1 = Error('error');
      const arg2 = 'foo';
      const xs = [arg1, arg2];
      const dispatch = sinon.spy();

      // when
      ErrorProvider.toastErrors(xs, dispatch);

      // then
      // todo [adgo] - 30.04.2016 - fix and uncomment
      // expect(ErrorProvider.toastError.calledWith(arg1)).to.be.true;
      // expect(ErrorProvider.toastError.calledWith(arg2)).to.be.false;
    });
  });

  describe('TOAST ERROR', () => {
    it('should call dispatch', () => {
      // given
      const err = Error('error');
      const dispatch = sinon.spy();

      // when
      ErrorProvider.toastError(err, dispatch);

      // then
      expect(dispatch.called).to.be.true;
    });
  });
});
