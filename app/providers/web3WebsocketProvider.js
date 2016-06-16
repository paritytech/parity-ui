/* global WebSocket */

import { keccak_256 } from 'js-sha3'; // eslint-disable-line camelcase

export default class Ws {

  constructor (token, addTokenListener, wsPath) {
    this.wsPath = wsPath;
    this.callbacks = {};
    this.isWsConnected = false;
    this.queue = []; // hold calls until ws is connected on init or if disconnected
    this.init(token);
    // todo [adgo] - move logic to react
    addTokenListener(::this.onTokenChange);
  }

  onTokenChange (token) {
    // token did not change
    if (token === false) {
      return;
    }
    this.init(token);
  }

  init (token) {
    this.token = token;

    if (!token) {
      return this.onUnAuthorized();
    }

    const hash = this.hash(token);

    // Initializing WebSocket with wrong hash will throw an error
    // So it's wrapped in try/ catch
    try {
      this.ws = new WebSocket('ws://' + this.wsPath, hash);
    } catch (e) {
      console.warn('[Web3 WS Provider] error connecting to WS ', e);
      return this.onUnAuthorized();
    }

    this.ws.addEventListener('error', ::this.onWsError);
    this.ws.addEventListener('open', ::this.onWsOpen);
  }

  onUnAuthorized () {
    this.isWsConnected = false;
  }

  // todo [adgo] - add comment: link to explanation
  hash (sysuiToken) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(sysuiToken + ':' + time) + '_' + time;
  }

  onWsOpen () {
    console.log('[Web3 WS Provider] connected');
    this.isWsConnected = true;
    this.executeQueue();
    this.ws.addEventListener('close', ::this.onWsClose);
    this.ws.addEventListener('message', ::this.onWsMsg);
  }

  onWsError (err) {
    console.warn('[Web3 WS Provider] error ', err);
  }

  onWsClose () {
    console.warn('[Web3 WS Provider] closed!');
    this.errorOutCallbacks();
    this.init();
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
      return console.warn('[Web3 WS Provider] unknown msg from server: ', msg, err);
    }
    const cb = this.callbacks[msg.id];
    delete this.callbacks[msg.id];
    if (!cb) {
      // Ignoring - no one is waiting for that response.
      return;
    }
    // callback otherwise
    cb(null, msg); // web3 uses error first cb style
  }

  sendAsync (payload, cb) {
    if (!this.isWsConnected) {
      this.queue.push({ payload, cb });
      return console.log('WS: incoming msg when not connected, adding to queue');
    }
    const id = payload.id;
    this.ws.send(JSON.stringify(payload));
    if (!cb) {
      return;
    }

    this.callbacks[id] = cb;
  }

  executeQueue () {
    console.log('[Web3 WS Provider] executing queue: ', this.queue);
    this.queue.forEach(call => {
      this.sendAsync(call.payload, call.cb);
    });
    this.queue = [];
  }

  // Compatibility with rest of W3 providers
  isConnected () {
    return this.isWsConnected;
  }

}
