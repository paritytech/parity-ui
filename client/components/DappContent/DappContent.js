import React from 'react';
import styles from './styles.css';

import {Web3Component} from '../Web3Component/Web3Component';

export class DappContent extends Web3Component {

  constructor (...args) {
    super(...args);

    window.addEventListener('message', (ev) => {
      const {origin, data, source} = ev;
      const {type, payload} = data;
      function reply (res) {
        source.postMessage(res, origin);
      }

      if (type === 'web3_sendAsync') {
        if (payload.method === 'eth_accounts') {
          delete payload.method;
          payload.result = this.props.accounts;
          reply({
            type,
            err: null,
            response: payload,
            id: payload.id
          });
          return;
        }

        this.provider().sendAsync(payload, (err, response) => {
          reply({
            type, err, response,
            id: payload.id
          });
        });
        return;
      }
      console.warn('Did not understood:', data);
    });
  }

  provider () {
    return this.context.web3.currentProvider;
  }

  render () {
    return (
      <iframe
        seamless
        className={styles.content}
        src={'dapp.html'}
        />
    );
  }

  static propTypes = {
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };
}
