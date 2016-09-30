import React, { Component, PropTypes } from 'react';

import DefaultRequest from '../DefaultRequest';

import Web3Compositor from '../Web3Compositor';

class DefaultRequestWeb3 extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    payload: PropTypes.any.isRequired,
    isFinished: PropTypes.bool.isRequired,
    isSending: PropTypes.bool,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    status: PropTypes.string,
    className: PropTypes.string,
    result: PropTypes.any
  };

  state = {
    chain: 'homestead',
    balance: null // avoid required prop loading warning
  }

  render () {
    const { web3 } = this.context;
    const { balance, chain } = this.state;
    const { onConfirm, onReject, isSending, isFinished, className, id, status, result, name, payload } = this.props;

    const address = web3.toChecksumAddress(this.props.address);

    return (
      <DefaultRequest
        address={ address }
        balance={ balance }
        onConfirm={ onConfirm }
        onReject={ onReject }
        isSending={ isSending }
        isFinished={ isFinished }
        id={ id }
        chain={ chain }
        status={ status }
        result={ result }
        className={ className }
        name={ name }
        payload={ payload }
        />
    );
  }

  onTick (next) {
    this.fetchChain();
    this.fetchBalance(next);
  }

  fetchChain () {
    this.context.web3.ethcore.getNetChain((err, chain) => {
      if (err) {
        return console.warn('err fetching chain', err);
      }
      this.setState({ chain });
    });
  }

  fetchBalance (next) {
    const { address } = this.props;

    this.context.web3.eth.getBalance(address, (err, balance) => {
      next(err);

      if (err) {
        console.warn('err fetching balance for ', address, err);
        return;
      }

      this.setState({ balance });
    });
  }

}

export default Web3Compositor(DefaultRequestWeb3);
