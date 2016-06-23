import { keccak_256 } from 'js-sha3';
import logger from './logger';

export default class Ws {

  constructor (opts) {
    this.path = opts.path || window.location.host;
    this.reconnectTimeout = opts.reconnectTimeout || 5000;
    this.onMsg = opts.onMsg || noop;
    this.onOpen = opts.onOpen || noop;
    this.onError = opts.onError || noop;
    this.onClose = opts.onClose || noop;
    this._isConnected = false;
    this._callbacks = {};
    this._queue = [];
    this._id = 1;
  }

  init = token => {
    clearTimeout(this._initTimeout);
    try {
      const hash = this._hash(token);
      this._ws = new WebSocket(`ws://${this.path}`, hash);
    } catch (err) {
      logger.warn('[WS] error connecting to ws', err);
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
    this.onError();
    this._initTimeout = setTimeout(() => this.init(this._token), this._reconnectTimeout);
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
    for (const msgId in this._callbacks) {
      const cb = callbacks[msgId];
      ('[WS] disconnected, cb cannot be called');
    }
    this._callbacks = {};
  }

  _hash (token) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(token + ':' + time) + '_' + time;
  }

}

function noop () {}
