// Frame provider

export class FrameProvider {

  static withFallback (fallback) {
    return new FrameProvider(fallback);
  }

  constructor (fallback) {
    this.fallback = fallback;
    this.callbacks = {};

    window.addEventListener('message', (ev) => {
      const {data} = ev;
      const {id, err, response} = data;

      this.callbacks[id](err, response);
      delete this.callbacks[id];
    });
  }

  win () {
    return window.parent;
  }

  post (type, payload) {
    const win = this.win();
    win.postMessage({
      type, payload
    }, win.location.origin);
  }

  prepareRequest (async) {
    console.log('prepareRequest', async);
    return this.fallback.prepareRequest(async);
  }

  send (payload) {
    console.log('send', payload);
    return this.fallback.send(payload);
  }

  sendAsync (payload, callback) {
    // console.log('sendAsync', payload, callback);
    this.callbacks[payload.id] = callback;
    this.post('web3_sendAsync', payload);
    // return this.fallback.sendAsync(payload, callback);
  }

  isConnected () {
    console.log('isConnected');
    return this.fallback.isConnected();
  }

}
