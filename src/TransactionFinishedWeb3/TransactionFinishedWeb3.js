import React, { Component, PropTypes } from 'react';

import TransactionFinished from '../TransactionFinished';
import Web3Compositor from '../Web3Compositor';

class TransactionFinishedWeb3 extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  state = {
    chain: 'homestead'
  };

  onTick (next) {
    this.fetchChain(next);
  }

  fetchChain (next) {
    this.context.web3.ethcore.getNetChain((err, chain) => {
      next(err);

      if (err) {
        return console.warn('err fetching chain', err);
      }

      this.setState({ chain });
    });
  }

  render () {
    const { chain } = this.state;
    const { web3 } = this.context;

    let { from, to } = this.props;
    from = web3.toChecksumAddress(from);
    to = to ? web3.toChecksumAddress(to) : to;

    return (
      <TransactionFinished
        { ...this.props }
        from={ from }
        to={ to }
        chain={ chain }
        />
    );
  }
}

export default Web3Compositor(TransactionFinishedWeb3);
