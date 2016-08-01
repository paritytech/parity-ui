import React, { Component, PropTypes } from 'react';

import Account from '../Account';
import TransactionPendingForm from '../TransactionPendingForm';
import TransactionFinished from '../TransactionFinished';
import TxHashLink from '../TxHashLink';

import styles from './styles.css';

export default class SignRequest extends Component {

  // TODO [todr] re-use proptypes?
  static propTypes = {
    id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    isFinished: PropTypes.bool.isRequired,
    chain: PropTypes.string.isRequired,
    balance: PropTypes.object,
    isSending: PropTypes.bool,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    status: PropTypes.string,
    className: PropTypes.string
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
    const { address, balance, chain, hash } = this.props;

    return (
      <div className={ styles.signDetails }>
        <div className={ styles.address }>
          <Account address={ address } balance={ balance } chain={ chain } />
        </div>
        <div className={ styles.info } title={ hash }>
          <p>Dapp is requesting to sign arbitrary transaction using this account.</p>
          <p>Confirm the transaction only if you trust the app.</p>
        </div>
      </div>
    );
  }

  renderActions () {
    const { isFinished, status } = this.props;

    if (isFinished) {
      if (status === 'confirmed') {
        const { chain, hash} = this.props;

        return (
          <div>
            <span className={ styles.isConfirmed }>Transaction confirmed:</span>
            <TxHashLink chain={ chain } txHash={ hash } className={ styles.txHash } />
          </div>
        );
      }

      return (
        <span className={ styles.isRejected }>Signing rejected.</span>
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
