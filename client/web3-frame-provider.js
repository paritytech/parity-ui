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
