import React, { Component, PropTypes } from 'react';

import TransactionMainDetails from '../TransactionMainDetails';
import TxHashLink from '../TxHashLink';
import styles from './TransactionFinished.css';

export default class TransactionFinished extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired, // eth
    ethValue: PropTypes.number.isRequired, // eth
    chain: PropTypes.string.isRequired,
    fee: PropTypes.number.isRequired,
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.string, // undefined if it's a contract
    txHash: PropTypes.string, // undefined if transacation is rejected
    className: PropTypes.string,
    data: PropTypes.string
  };

  render () {
    const { chain, txHash, className } = this.props;
    const TxHash = txHash ? <TxHashLink chain={ chain } txHash={ txHash } /> : '';
    return (
      <div className={ `${styles.container} ${className || ''}` }>
        <div className={ styles.mainContainer }>
          <TransactionMainDetails { ...this.props } />
          <div className={ styles.status }>
            { this.renderStatus() }
            { TxHash }
          </div>
        </div>
      </div>
    );
  }

  renderStatus () {
    const { txHash } = this.props;
    const status = txHash ? 'Confirmed' : 'Rejected';
    const className = txHash ? styles.isConfirmed : styles.isRejected;
    return (
      <div className={ className }>{ status } </div>
    );
  }

}
