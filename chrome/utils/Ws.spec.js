import Ws from './Ws';

describe('Ws', () => {
  let cut;
  const path = 'localhost:3050';
  const fullPath = 'ws://' + path;
  const reconnectTimeout = 20;
  const token = '1kd8-21Ri-3jf8-ce3t';
  const originalWebSocket = global.WebSocket;

  beforeEach('construct intance', () => {
    cut = new Ws({
      path,
      reconnectTimeout,
      onMsg: sinon.spy(),
      onOpen: sinon.spy(),
      onError: sinon.spy(),
      onClose: sinon.spy()
    });
  });

  describe('constructor', () => {
    it('should assign properties', () => {
      expect(cut.path).to.equal(path);
      expect(cut.reconnectTimeout).to.equal(reconnectTimeout);
      expect(cut.onMsg).to.equal(sinon.spy());
      expect(cut.onOpen).to.equal(sinon.spy());
      expect(cut.onError).to.equal(sinon.spy());
      expect(cut.onClose).to.equal(sinon.spy());
      expect(cut._isConnected).to.be.false;
      expect(cut._callbacks).to.eql({});
      expect(cut._queue).to.eql({});
      expect(cut._id).to.eql(1);
      expect(cut._initTimeout).to.be.undefined;
      expect(cut._ws).to.not.undefined;
    });

    it('should assign default properties', () => {
      cut = new Ws();
      expect(cut.path).to.equal(window.location.host);
      expect(cut.reconnectTimeout).to.equal(5000);
      expect(cut.onMsg).to.equal(cut._noop);
      expect(cut.onOpen).to.equal(cut._noop);
      expect(cut.onError).to.equal(cut._noop);
      expect(cut.onClose).to.equal(cut._noop);
    });
  });

  describe('init', () => {
    let mockedHashedToken = 'foo';
    before('mock global WebSocket and hash', () => {
      global.WebSocket = sinon.stub().returns({
        addEventListener: sinon.spy(),
        send: sinon.spy()
      });

      cut._hash = sinon.stub().returns(mockedHashedToken);
    });

    after('restore global WebSocket', () => {
      global.WebSocket = originalWebSocket;
      cut._hash.restore();
    });

    it('should clear _initTimeout', (done) => {
      // given
      let spy = sinon.spy();
      cut._initTimeout = setTimeout(spy, 50);

      // when
      cut.init(token);

      // then
      setTimeout(() => {
        expect(spy.called).to.be.false;
        done();
      }, 50);
    });

    it('should call _hash', () => {
      // when
      cut.init(token);

      // then
      expect(cut._hash.calledWith(token)).to.be.true;
    });

    it('should create ws instance and add [open, close] event listeners', () => {
      // when
      cut.init(token);

      // then
      expect(global.WebSocket.calledWithNew()).to.be.true;
      expect(global.WebSocket.calledWith(fullPath), mockedHashedToken).to.be.true;
      expect(cut._ws.addEventListener.calledWith(
        'open', cut._onOpen
      )).to.be.true;

      expect(cut._ws.addEventListener.calledWith(
        'error', cut._onError
      )).to.be.true;
    });
  });

  describe('_onOpen', () => {
    beforeEach('mock ws instance', () => {
      cut._ws = sinon.spy();
    });

    it('should add event listeners to ws instance', () => {
      // when
      cut._onOpen();

      //then
      expect(cut._ws.calledWith('close', cut._onClose)).to.be.true;
      expect(cut._ws.calledWith('message', cut._onMsg)).to.be.true;
    });

    it('should set _isConnected to true', () => {
      // given
      expect(cut._isConnected).to.be.false;

      // when
      cut._onOpen();

      //then
      expect(cut._isConnected).to.be.true;
    });

    it('should call [onOpen, _executeQueue]', () => {
      // when
      cut._onOpen();

      //then
      expect(cut._executeQueue.called).to.be.true;
      expect(cut._onOpen.called).to.be.true;
    });
  });

  describe('_onClose', () => {
    beforeEach('mock ws instance', () => {
      cut._executeCbsWithError = sinon.spy();
      cut.init = sinon.spy();
    });

    it('should call [_executeCbsWithError, onClose, init]', () => {
      // when
      cut._onClose();

      //then
      expect(cut._executeCbsWithError.called.to.be.true;
      expect(cut.onClose.called.to.be.true;
      expect(cut.init.calledWith(token).to.be.true;
    });

    it('should set _isConnected to false', () => {
      // given
      cut._isConnected = true;

      // when
      cut._onClose();

      //then
      expect(cut._isConnected).to.be.false;
    });
  });

  describe('_onError', () => {
    it('should call onError', () => {
      // given
      const err = new Error('something bad');

      // when
      cut._onError(err);

      // then
      expect(cut.onError.calledWith(err)).to.be.true;
    });

    it('should call _initWithTimeout and define _initTimeout', () => {
      // given
      cut._initWithTimeout = sinon.spy();

      // when
      cut._onError();

      // then
      expect(cut._initWithTimeout.called).to.be.true;
      expect(cut._initTimeout).to.not.be.undefined;
    });
  });

  describe('_initWithTimeout', done => {
    
  });


});
