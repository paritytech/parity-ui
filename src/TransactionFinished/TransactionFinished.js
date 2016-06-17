import React, { Component, PropTypes } from 'react';

import TransactionMainDetails from '../TransactionMainDetails';
import TxHashLink from '../TxHashLink';
import styles from './TransactionFinished.css';

import * as tUtil from '../util/transaction';

export default class TransactionFinished extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.object, // eth BigNumber, not required since it mght take time to fetch
    value: PropTypes.string.isRequired, // wei hex
    chain: PropTypes.string.isRequired,
    gasPrice: PropTypes.string.isRequired, // wei hex
    gas: PropTypes.string.isRequired, // hex
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.object, // eth BigNumber - undefined if it's a contract or until it's fetched
    txHash: PropTypes.string, // undefined if transacation is rejected
    className: PropTypes.string,
    data: PropTypes.string
  };

  componentWillMount () {
    const { gas, gasPrice, value } = this.props;
    const fee = tUtil.getFee(gas, gasPrice); // BigNumber object
    const totalValue = tUtil.getTotalValue(fee, value);
    this.setState({ totalValue });
  }

  render () {
    const { chain, txHash, className } = this.props;
    const { totalValue } = this.state;
    const TxHash = txHash ? <TxHashLink chain={ chain } txHash={ txHash } /> : '';
    return (
      <div className={ `${styles.container} ${className || ''}` }>
        <div className={ styles.mainContainer }>
          <TransactionMainDetails
            { ...this.props }
            totalValue={ totalValue }
          />
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
