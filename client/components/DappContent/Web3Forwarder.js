export class Web3Forwarder {
  constructor (component) {
    this.component = component;
    this.addListener();
  }

  provider () {
    this.component.context.web3.currentProvider;
  }

  handleMethod (method, payload, cb) {
    if (method === 'eth_accounts') {
      const response = {
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result: this.component.props.accounts
      };
      return cb(null, response);
    }

    this.provider().sendAsync(payload, cb);
  }

  messageListener (ev) {
    const {origin, data, source} = ev;
    const {type, payload} = data;

    function reply (res) {
      source.postMessage(res, origin);
    }

    if (type === 'web3_sendAsync') {
      this.handleMethod(payload.method, payload, (err, response) => {
        reply({
          type, err, response, id: response.id
        });
      });
      return;
    }
    console.warn('Did not understood:', data);
  }

  onLoad (frame, url) {
    const selfOrigin = window.location.origin;
    const origin = (url.indexOf('://') !== -1) ? url : selfOrigin;

    frame.contentWindow.postMessage({
      type: 'parity_initial',
      payload: selfOrigin
    }, origin);
  }

  addListener () {
    window.addEventListener('message', ::this.messageListener);
  }
}
