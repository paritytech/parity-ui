/* global chrome */
import isEqual from 'lodash.isequal';
import { keccak_256 } from 'js-sha3';

export default class Ws {

  constructor () {
    this.id = 1;
    this.callbacks = {};
    this.isWsConnected = false;
    chrome.storage.onChanged.addListener(this.onSysuiTokenChange);
    this.queue = []; // hold calls until ws is connected on init or if disconnected
    this.init();
  }

  init () {
    chrome.storage.local.get('sysuiToken', obj => {
      let { sysuiToken } = obj;

      if (!sysuiToken) {
        return this.onNotAuthorized();
      }

      sysuiToken = JSON.parse(sysuiToken)
      const hash = this.hash(sysuiToken);

      // Initializing WebSocket with wrong hash will throw an error
      // So it's wrapped in try/ catch
      try {
        this.ws = new WebSocket('ws://localhost:8180', hash);
      } catch (e) {
        console.warn(e)
        return this.onNotAuthorized();
      }

      this.ws.addEventListener('error', ::this.onWsError);
      this.ws.addEventListener('open', ::this.onWsOpen);
    });
  }

  onNotAuthorized () {
    this.isWsConnected = false;
  }

  // when token changes in chrome LS
  onSysuiTokenChange = (changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return;
    }
    const newSysuiToken = JSON.parse(changes.sysuiToken.newValue);
    console.log('[Web3 WS Provider] sysuiToken changed! ', newSysuiToken);
    this.init();
  }

  // todo [adgo] - add comment: link to explanation
  hash (sysuiToken) {
    const time = parseInt(new Date().getTime() / 1000, 10);
    return keccak_256(sysuiToken + ':' + time) + '_' + time;
  }

  onWsOpen = () => {
    console.log('[Web3 WS Provider] connected')
    this.isWsConnected = true;
    this.executeQueue();
    this.ws.addEventListener('disconnect', ::this.onWsDisconnect);
    this.ws.addEventListener('message', ::this.onWsMsg);
  }

  onWsError = (err) => {
    console.warn('[Web3 WS Provider] error ', err);
  }

  onWsDisconnect = () => {
    console.warn('[Web3 WS Provider] disconnect!');
    this.init();
  }

  onWsMsg = msg => {
    console.log('[Web3 WS Provider] incoming msg ', msg)
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
    console.log('[Web3 WS Provider] send async: ', payload, 'with cb: ', !!cb);
    if (!this.isWsConnected) {
      this.queue.push({ payload, cb });
      return console.log('WS: incoming msg when not connected, adding to queue');
    }
    this.id++;
    const { id } = this;
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
  }


  // Compatibility with rest of W3 providers
  isConnected () {
    return this.isWsConnected;
  }

}
