import { keccak_256 } from 'js-sha3';
import logger from './logger';

export default class Ws {

  constructor (opts) {
    this.path = opts.path || '127.0.0.1';
    this.port = opts.port || '8180';
    this.reconnectTimeout = opts.reconnectTimeout || 5000;
    this.onOpen = opts.onOpen || noop;
    this.onError = opts.onError || noop;
    this.onClose = opts.onClose || noop;
    this.isConnected = false;
    this.callbacks = {};
    this.queue = [];
    this.id = 1;
  }

  init = token => {
    clearTimeout(this.initTimeout);
    try {
      const hash = this.hash(token);
      this.ws = new WebSocket(`ws://${this.path}:${this.port}`, hash);
    } catch (err) {
      logger.warn('[WS] error connecting to ws', err);
    }

    this.ws.addEventListener('open', this.onOpen);
    this.ws.addEventListener('error', this.onError);
  }

  onOpen = () => {
    logger.log('[WS] connected');
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('message', this.onMsg);
    this.isConnected = true;
    this.executeQueue();
    this.onOpen();
  }

  onClose = () => {
    logger.warn('[WS] closed');
    this.executeCbsWithError();
    this.isConnected = false;
    this.onClose();
    this.init(this.token);
  }

  onError = err => {
    logger.warn('[WS] error', err);
    this.onError();
    this.initTimeout = setTimeout(() => this.init(this.token), this.reconnectTimeout);
  }

  onMsg = msg => {
    try {
      msg = JSON.parse(msg.data);
    } catch (err) {
      return logger.warn('[WS] unknown msg from server: ', msg, err);
    }
    const cb = this.callbacks[msg.id];
    delete this.callbacks[msg.id];
    if (!cb) {
      // Ignoring - no one is waiting for that response.
      return;
    }
    // callback otherwise
    cb(msg.result);
  }

  send (payload, callback) {
    if (!this.isConnected) {
      logger.log('[WS] not connected. incoming msg added to queue');
      this.queue.push({ payload, callback });
      return;
    }
    const { id } = this;
    payload.id = id;
    payload = JSON.stringify(payload);
    this.callbacks[id] = callback;
    this.ws.send(payload);
    this.id++;
  }

  executeQueue () {
    logger.log('[WS] executing queue: ', this.queue);
    this.queue.forEach(call => {
      this.send(call.payload, call.callback);
    });
    this.queue = [];
  }

  executeCbsWithError () {
    logger.log('[WS] executing callbacks with error: ', this.callbacks);
    for (const msgId in this.callbacks) {
      callbacks[msgId]('[WS] disconnected, cb cannot be called');
    }
    this.callbacks = {};
  }

  hash (token) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(token + ':' + time) + '_' + time;
  }

}

function noop () {}
