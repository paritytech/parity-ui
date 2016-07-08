import { keccak_256 } from 'js-sha3'; // eslint-disable-line camelcase
import logger from './logger';

export default class Ws {

  constructor (opts) {
    this._assignOpts(opts);
    this._isConnected = false;
    this._callbacks = {};
    this._queue = [];
    this._id = 1;
  }

  _assignOpts (opts = {}) {
    if (!opts.path && !window) {
      throw Error('[WS] must pass path when no window object');
    }
    this.path = opts.path || window.location.host;
    this.reconnectTimeout = opts.reconnectTimeout || 5000;
    this.onMsg = opts.onMsg || this._noop;
    this.onOpen = opts.onOpen || this._noop;
    this.onError = opts.onError || this._noop;
    this.onClose = opts.onClose || this._noop;
  }

  init = token => {
    this._token = token; // store token for _onClose reconnect attemps
    clearTimeout(this._initTimeout);
    try {
      const hash = this._hash(token);
      this._ws = new global.WebSocket(`ws://${this.path}`, hash);
    } catch (err) {
      logger.warn('[WS] error connecting to ws', err); // throws when port is blocked, not when hash is incorrect
    }

    this._ws.addEventListener('open', this._onOpen);
    this._ws.addEventListener('error', this._onError);
  }

  _onOpen = () => {
    logger.log('[WS] connected');
    this._ws.addEventListener('close', this._onClose);
    this._ws.addEventListener('message', this._onMsg);
    this._isConnected = true;
    this._executeQueue();
    this.onOpen();
  }

  _onClose = () => {
    logger.warn('[WS] closed');
    this._executeCbsWithError();
    this._isConnected = false;
    this.onClose();
    this.init(this._token);
  }

  _onError = err => {
    logger.warn('[WS] error', err);
    this.onError(err);
    this._initTimeout = this._initWithTimeout();
  }

  _initWithTimeout () {
    return setTimeout(() => this.init(this._token), this._reconnectTimeout);
  }

  _onMsg = msg => {
    this.onMsg(msg);
    try {
      msg = JSON.parse(msg.data);
    } catch (err) {
      return logger.warn('[WS] unknown msg from server: ', msg, err);
    }
    const cb = this._callbacks[msg.id];
    delete this._callbacks[msg.id];
    if (!cb) {
      // Ignoring - no one is waiting for that response.
      return;
    }
    // callback otherwise
    cb(msg.result);
  }

  send (payload, callback) {
    if (!this._isConnected) {
      logger.log('[WS] not connected. incoming msg added to queue');
      this._queue.push({ payload, callback });
      return;
    }
    const { _id } = this;
    payload.id = _id;
    payload = JSON.stringify(payload);
    this._callbacks[_id] = callback;
    this._ws.send(payload);
    this._id++;
  }

  _executeQueue () {
    logger.log('[WS] executing queue: ', this._queue);
    this._queue.forEach(call => {
      this.send(call.payload, call.callback);
    });
    this._queue = [];
  }

  _executeCbsWithError () {
    logger.log('[WS] executing callbacks with error: ', this._callbacks);
    this._callbacks.forEach(cb => cb('[WS] disconnected, cb cannot be called'));
    this._callbacks = {};
  }

  _hash (token) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(token + ':' + time) + '_' + time;
  }

  _noop () {}

}
