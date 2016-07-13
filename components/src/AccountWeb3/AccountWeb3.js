import React, { Component, PropTypes } from 'react';

import Account from '../Account';
import Web3Compositor from '../Web3Compositor';

class AccountWeb3 extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    address: PropTypes.string.isRequired,
    chain: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string
  };

  state = {
    balance: null
  };

  render () {
    const { address, chain, name } = this.props;
    return (
      <Account
        address={ address }
        chain={ chain }
        name={ name }
        balance={ this.state.balance }
      />
    );
  }

  // todo [adgo] - call next() only after all CBs are executed
  onTick (next) {
    this.fetchBalance(next);
  }

  fetchBalance (next) {
    const { address } = this.props;
    this.context.web3.eth.getBalance(address, (err, balance) => {
      next(err);

      if (err) {
        console.warn('err fetching balance for ', address, err);
        return;
      }

      this.setState({
        balance
      });
    });
  }

}

export default Web3Compositor(AccountWeb3);
