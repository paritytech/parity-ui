/* global describe, it, beforeEach, afterEach, expect */

import sinon from 'sinon';
import ToastrMiddleware from './toastr';
import { addToast, removeToast, addSuccessToast, addErrorToast } from '../actions/toastr';

describe('MIDDLEWARE: TOASTR', () => {
  let cut, state;
  const time = 20;
  let toastNo = 1;

  beforeEach('mock cut', () => {
    cut = new ToastrMiddleware(time);
    state = {
      toastr: {
        toastNo: toastNo
      }
    };
  });

  describe('TO MIDDLEWARE', () => {
    beforeEach('mock methods', () => {
      cut.onAddToast = sinon.spy();
      cut.onAddErrorToast = sinon.spy();
      cut.onAddSuccessToast = sinon.spy();
    });

    it('should call only onAddToast when respected action is dispatched', () => {
      // given
      const store = null;
      const next = sinon.spy();
      const middleware = cut.toMiddleware()(store)(next);
      const action = { type: 'add toast', payload: '' };
      expect(middleware).to.be.a('function');
      expect(action).to.be.an('object');

      // when
      middleware(action);

      // then
      expect(cut.onAddToast.calledWith(store, next, action)).to.be.true;
      expect(cut.onAddErrorToast.called).to.be.false;
      expect(cut.onAddSuccessToast.called).to.be.false;
    });

    it('should call only onAddErrorToast when respected action is dispatched', () => {
      // given
      const store = null;
      const next = sinon.spy();
      const middleware = cut.toMiddleware()(store)(next);
      const action = addErrorToast('success!');
      expect(middleware).to.be.a('function');
      expect(action).to.be.an('object');

      // when
      middleware(action);

      // then
      expect(cut.onAddErrorToast.calledWith(store, next, action)).to.be.true;
      expect(cut.onAddToast.called).to.be.false;
      expect(cut.onAddSuccessToast.called).to.be.false;
    });

    it('should call only onAddSuccessToast when respected action is dispatched', () => {
      // given
      const store = null;
      const next = sinon.spy();
      const middleware = cut.toMiddleware()(store)(next);
      const action = addSuccessToast('success!');
      expect(middleware).to.be.a('function');
      expect(action).to.be.an('object');

      // when
      middleware(action);

      // then
      expect(cut.onAddSuccessToast.calledWith(store, next, action)).to.be.true;
      expect(cut.onAddToast.called).to.be.false;
      expect(cut.onAddErrorToast.called).to.be.false;
    });

    it('should not call any methods when non respected action is dispatched', () => {
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
      expect(cut.onAddToast.called).to.be.false;
      expect(cut.onAddErrorToast.called).to.be.false;
      expect(cut.onAddSuccessToast.called).to.be.false;
    });
  });

  describe('onAddToast', () => {
    it('should add toast and remove it after timeout', (done) => {
      // given
      const toast = { message: 'test text' };
      const store = {
        getState: () => state,
        dispatch: sinon.spy()
      };
      const next = sinon.spy();
      const action = addToast(toast);

      // when
      cut.onAddToast(store, next, action);

      // then
      expect(next.calledWith(addToast({
        ...toast,
        toastNo: toastNo
      }))).to.be.true;

      setTimeout(() => {
        expect(store.dispatch.calledWith(removeToast(toastNo))).to.be.true;
        done();
      }, time);
    });
  });

  describe('TOASTS WITH TYPE', () => {
    beforeEach('spy on onAddToast', () => {
      cut.onAddToast = sinon.spy();
      sinon.spy(cut, 'ensureObject');
    });
    afterEach('unspy on onAddToast', () => {
      cut.ensureObject.restore();
    });

    it('should call ensureObject, modify action with error params and call onAddToast', () => {
      // given
      const msg = 'error';
      const store = null;
      const next = null;
      const action = addErrorToast(msg);

      // when
      cut.onAddErrorToast(store, next, action);

      // then
      expect(cut.ensureObject.calledWith(msg)).to.be.true;
      expect(action).to.eql({
        type: 'add toast',
        payload: {
          message: msg,
          type: 'error'
        }
      });
      expect(cut.onAddToast.calledWith(store, next, action)).to.be.true;
    });

    it('should call ensureObject, modify action with success params and call onAddToast', () => {
      // given
      const msg = 'success';
      const store = null;
      const next = null;
      const action = addSuccessToast(msg);

      // when
      cut.onAddSuccessToast(store, next, action);

      // then
      expect(cut.ensureObject.calledWith(msg)).to.be.true;
      expect(action).to.eql({
        type: 'add toast',
        payload: {
          message: msg,
          type: 'success'
        }
      });
      expect(cut.onAddToast.calledWith(store, next, action)).to.be.true;
    });
  });

  describe('ENSURE OBJECT', () => {
    it('should convert toast string to object', () => {
      // given
      const txt = 'test text';

      // when
      const result = cut.ensureObject(txt);

      // then
      expect(result).to.eql({ message: txt });
    });

    it('should pass object without modifying', () => {
      // given
      const obj = { message: 'test text' };

      // when
      const result = cut.ensureObject(obj);

      // then
      expect(result).to.eql(obj);
    });
  });
});
