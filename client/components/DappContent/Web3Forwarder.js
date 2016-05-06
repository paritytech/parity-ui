
import {parseAddress} from './address';

export class Web3Forwarder {
  constructor (component) {
    this.component = component;
    this.addListener();
  }

  provider () {
    return this.component.context.web3.currentProvider;
  }

  sendTransaction (payload, cb) {
    this.handleMethod('.', payload, cb);
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

    if (method === 'eth_sendTransaction') {
      // TODO sorry for that - need redux so badly ;)
      this.component.setState({
        sendingTransaction: true,
        transaction: payload,
        cb: (err, pass) => {
          this.component.setState({
            sendingTransaction: false,
            transaction: null,
            cb: null
          });
          if (err) {
            return cb(err);
          }
          console.log('Password: ' + pass);
          this.provider().sendAsync(payload, cb);
        }
      });
      return;
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
    const address = parseAddress(url);
    const origin = (address.protocol === 'local') ? selfOrigin : address.url;

    frame.contentWindow.postMessage({
      type: 'parity_initial',
      payload: selfOrigin
    }, origin);
  }

  addListener () {
    window.addEventListener('message', ::this.messageListener);
  }
}
