import React, { Component, PropTypes } from 'react';

import Account from '../Account';
import TransactionPendingForm from '../TransactionPendingForm';
import TxHashLink from '../TxHashLink';

// TODO [ToDr] Styles re-used
import styles from '../SignRequest/SignRequest.css';

export default class DecryptRequest extends Component {

  // TODO [todr] re-use proptypes?
  static propTypes = {
    id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isFinished: PropTypes.bool.isRequired,
    chain: PropTypes.string.isRequired,
    balance: PropTypes.object,
    isSending: PropTypes.bool,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    status: PropTypes.string,
    className: PropTypes.string,
    result: PropTypes.string,
  };

  render () {
    const className = this.props.className || '';
    return (
      <div className={ `${styles.container} ${className}` }>
        { this.renderDetails() }
        { this.renderActions() }
      </div>
    );
  }

  renderDetails () {
    const { address, balance, chain, message } = this.props;

    return (
      <div className={ styles.signDetails }>
        <div className={ styles.address }>
          <Account address={ address } balance={ balance } chain={ chain } />
        </div>
        <div className={ styles.info } title={ message }>
          <p>Dapp is requesting to decrypt a message using this account.</p>
        </div>
      </div>
    );
  }

  renderActions () {
    const { isFinished, status } = this.props;

    if (isFinished) {
      if (status === 'confirmed') {
        const { chain, hash, result } = this.props;

        return (
          <div className={ styles.actions }>
            <span className={ styles.isConfirmed }>Confirmed</span>
            <div>
              <p>Result:</p>
              <pre className={ styles.raw }>{ hex2a(result.substr(2)) }</pre>
              <textarea className={ styles.raw } readOnly>{ result }</textarea>
            </div>
          </div>
        );
      }

      return (
        <div className={ styles.actions }>
          <span className={ styles.isRejected }>Rejected</span>
        </div>
      );
    }

    return (
      <TransactionPendingForm
        isSending={ this.props.isSending }
        onConfirm={ this.onConfirm }
        onReject={ this.onReject }
        className={ styles.actions }
        />
    );
  }

  onConfirm = password => {
    const { id } = this.props;
    this.props.onConfirm({ id, password });
  }

  onReject = () => {
    this.props.onReject(this.props.id);
  }

}

function hex2a(hex) {
  hex = hex.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}
