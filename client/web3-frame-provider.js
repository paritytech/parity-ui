// Frame provider

export class FrameProvider {

  static withFallback (fallback) {
    let frame = new FrameProvider();
    if (frame.win()) {
      return frame;
    }

    return fallback;
  }

  constructor () {
    this.callbacks = {};
    this.origin = window.location.origin;

    window.addEventListener('message', (ev) => {
      const {data} = ev;
      const {id, err, response} = data;

      if (data.type === 'parity_initial') {
        this.origin = data.payload;
        return;
      }

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
    }, this.origin);
  }

  prepareRequest (async) {
    // nothing to do
  }

  send (payload) {
    throw new Error('Synchronous requests are not supported.');
  }

  sendAsync (payload, callback) {
    this.callbacks[payload.id] = callback;
    this.post('web3_sendAsync', payload);
  }

  isConnected () {
    // TODO isConnected tracking?
    return true;
  }

}
