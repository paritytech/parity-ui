import React, { Component, PropTypes } from 'react';

import ErrorIcon from 'material-ui/svg-icons/alert/error';

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
    status: PropTypes.string.isRequired, // rejected, confirmed
    msg: PropTypes.string.isRequired,
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
    const { chain, className } = this.props;
    const { totalValue } = this.state;
    
    return (
      <div className={ `${styles.container} ${className || ''}` }>
        <div className={ styles.mainContainer }>
          <TransactionMainDetails
            { ...this.props }
            totalValue={ totalValue }
            className={ styles.transactionDetails }
          />
          <div className={ styles.statusContainer }>
            { this.renderStatus() }
          </div>
        </div>
      </div>
    );
  }

  renderStatus () {
    const { status, msg } = this.props;
    const msgClassName = status === 'confirmed' ? styles.isConfirmed : styles.isRejected;
    return (
      <div>
        { this.renderError() }
        <span className={ msgClassName }>{ msg }</span>
        { this.renderTxHash() }
      </div>
    );
  }

  renderTxHash () {
    const { txHash, chain } = this.props;
    if (!txHash) {
      return;
    }

    return (
      <div>
        Transaction hash: <br />
        <TxHashLink chain={ chain } txHash={ txHash } className={ styles.txHash } />
      </div>
    )
  }

  renderError () {
    if (!this.props.error) {
      return;
    }

    return (
      <div className={ styles.error }>
        <ErrorIcon className={ styles.error } />
        <span>Error processing transaction!</span>
      </div>
    );
  }

}
