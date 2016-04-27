/* global describe, it, beforeEach, expect */

import sinon from 'sinon';
import ToastrMiddleware from './toastr';
import {addToast, removeToast} from '../actions/toastr';

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
    });
  });

  describe('ADD', () => {
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

    it('should convert toast string to object', () => {
      // given
      const txt = 'test text';

      // when
      const result = cut.ensureObject(txt);

      // then
      expect(result).to.eql({ message: txt });
    });
  });
});
