import React, { Component, PropTypes } from 'react';

import TransactionPendingWeb3 from '../TransactionPendingWeb3';
import SignWeb3 from '../SignRequestWeb3';
import DecryptWeb3 from '../DecryptRequestWeb3';
import Web3Compositor from '../Web3Compositor';

class RequestPendingWeb3 extends Component {

  static contextTypes = {
    web3: PropTypes.object.isRequired
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    isSending: PropTypes.bool.isRequired,
    payload: PropTypes.object.isRequired,
    className: PropTypes.string,
    result: PropTypes.any,
    msg: PropTypes.string,
    status: PropTypes.string,
    error: PropTypes.string,
  };

  render () {
    const { payload, id, className, isSending, onConfirm, onReject } = this.props;
    const { result, msg, status, error } = this.props;
    const isFinished = !!result;

    const components = {
      sign (sign) {
        return (
          <SignWeb3
            className={ className }
            onConfirm={ onConfirm }
            onReject={ onReject }
            isSending={ isSending }
            isFinished={ isFinished }
            id={ id }
            address={ sign.address }
            hash={ sign.hash }
            result={ result }
            msg={ msg }
            status={ status }
            error={ error }
            />
        );
      },
      transaction(transaction) {
        if (result) {
          return (
            <TransactionFinishedWeb3
              className={ className }
              txHash={ result }
              id={ id }
              gasPrice={ transaction.gasPrice }
              gas={ transaction.gas }
              from={ transaction.from }
              to={ transaction.to }
              value={ transaction.value }
              msg={ msg }
              status={ status }
              error={ error }
            />
          );
        }
        return (
          <TransactionPendingWeb3
            className={ className }
            onConfirm={ onConfirm }
            onReject={ onReject }
            isSending={ isSending }
            id={ id }
            gasPrice={ transaction.gasPrice }
            gas={ transaction.gas }
            data={ transaction.data }
            from={ transaction.from }
            to={ transaction.to }
            value={ transaction.value }
            />
        );
      },

      decrypt(decrypt) {
        return (
          <DecryptWeb3
            className={ className }
            onConfirm={ onConfirm }
            onReject={ onReject }
            isSending={ isSending }
            isFinished={ isFinished }
            id={ id }
            address={ decrypt.address }
            message={ decrypt.msg }
            result={ result }
            msg={ msg }
            status={ status }
            error={ error }
            />
        );
      },

      default(data) {
        return null;
      }
    };

    const type = Object.keys(payload)[0];
    const renderer = components[type] || components.default;
    return renderer(payload[type]);
  }
}

export default Web3Compositor(RequestPendingWeb3);
