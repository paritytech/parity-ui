
/* global WebSocket */

import { keccak_256 } from 'js-sha3'; // eslint-disable-line camelcase

export default class Ws {

  constructor (wsPath) {
    this.wsPath = wsPath;
    this.id = 1;
    this.callbacks = {};
    this.isConnected = false;
    this.queue = []; // hold calls until ws is connected on init or if disconnected
  }

  init (token) {
    this.token = token;

    const hash = this.hash(this.token);

    try {
      this.ws = new WebSocket('ws://' + this.wsPath, hash);
    } catch (err) {
      console.warn('cant connect to ws ', err);
    }
    this.ws.addEventListener('error', ::this.onWsError);
    this.ws.addEventListener('open', ::this.onWsOpen);
  }

  // todo [adgo] - add comment: link to explanation
  hash (token) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(token + ':' + time) + '_' + time;
  }

  onWsOpen () {
    console.log('[WS Base] connected');
    this.ws.addEventListener('close', ::this.onWsClose);
    this.ws.addEventListener('message', ::this.onWsMsg);
    this.isConnected = true;
  }

  onWsError (err) {
    console.warn('[WS Base] error ', err);
    this.isConnected = false;
  }

  onWsClose () {
    console.warn('[WS Base] closed!');
    this.errorOutCallbacks();
    this.isConnected = false;
    // try to reconnect
    this.init(this.token);
  }

  errorOutCallbacks () {
    const { callbacks } = this;
    for (const msgId in callbacks) {
      callbacks[msgId]('WS disconnected, cb cannot be called');
    }
    this.callbacks = {};
  }

  onWsMsg (msg) {
    try {
      msg = JSON.parse(msg.data);
    } catch (err) {
      return console.warn('[WS Base] unknown msg from server: ', msg, err);
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

  send (method, params, callback) {
    if (!this.isConnected) {
      this.queue.push({ method, params, callback });
      return console.log('[WS Base]: incoming msg when not connected, adding to queue');
    }
    const id = this.id;
    this.id++;
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id, method, params
    });
    this.callbacks[id] = callback;
    this.ws.send(payload);
  }

  executeQueue () {
    console.log('[WS Base] executing queue: ', this.queue);
    this.queue.forEach(call => {
      this.sendAsync(call.method, call.params, call.callback);
    });
    this.queue = [];
  }

}
