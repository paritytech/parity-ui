export default function Ws() {
  this.id = 1;
  this.callbacks = {};
  // TODO [ToDr] solve this for local development
  // this.ws = new WebSocket('ws://' + window.location.host + '/ws/');
  this.ws = new WebSocket('ws://localhost:8180');

  this.ws.addEventListener('open', function () {
    this.isConnected = true;
  }.bind(this));

  this.ws.addEventListener('message', function (msg) {
    try {
      msg = JSON.parse(msg.data);
    } catch (e) {
      console.error('Uknown message from server:', e, msg);
      return;
    }
    var cb = this.callbacks[msg.id];
    delete this.callbacks[msg.id];
    if (!cb) {
      // Ignoring - no one is waiting for that response.
      return;
    }
    // callback otherwise
    cb(msg.result);
  }.bind(this));
}

Ws.prototype = {
  send: function (method, params, callback) {
    var id = this.id++;
    var payload = JSON.stringify({
      jsonrpc: '2.0',
      id: id,
      method: method,
      params: params
    });
    this.callbacks[id] = callback;

    this.ws.send(payload);
  }
};
