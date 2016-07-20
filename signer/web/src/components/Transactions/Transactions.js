import React, { Component, PropTypes } from 'react';
import { TransactionPendingWeb3, TransactionFinishedWeb3 } from 'dapps-react-components';
import styles from './Transactions.css';

export default class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.shape({
      pending: PropTypes.array.isRequired,
      finished: PropTypes.array.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      startConfirmTransaction: PropTypes.func.isRequired,
      startRejectTransaction: PropTypes.func.isRequired
    }).isRequired
  };

  render () {
    const { pending, finished } = this.props.transactions;

    if (!pending.length && !finished.length) {
      return this.renderNoTransactionsMsg();
    }

    return (
      <div>
        { this.renderFinishedTransactions() }
        { this.renderPendingTransactions() }
      </div>
    );
  }

  renderPendingTransactions () {
    const { actions, transactions } = this.props;
    if (!transactions.pending.length) {
      return;
    }
    return (
      <div>
        <h2>Pending Transactions</h2>
        <div>
          {
            transactions.pending.map(
              data => (
                <TransactionPendingWeb3
                  className={ styles.transaction }
                  onConfirm={ actions.startConfirmTransaction }
                  onReject={ actions.startRejectTransaction }
                  key={ data.id }
                  id={ data.id }
                  gasPrice={ data.transaction.gasPrice }
                  gas={ data.transaction.gas }
                  data={ data.transaction.data }
                  from={ data.transaction.from }
                  to={ data.transaction.to }
                  value={ data.transaction.value || '0x0' }
                />
              )
            )
          }
        </div>
      </div>
    );
  }

  renderFinishedTransactions () {
    const { finished } = this.props.transactions;
    if (!finished.length) {
      return;
    }
    return (
      <div>
        <h2>Finished Transactions</h2>
        <div>
          {
            finished.map(
              data => (
                <TransactionFinishedWeb3
                  className={ styles.transaction }
                  txHash={ data.txHash }
                  key={ data.id }
                  id={ data.id }
                  gasPrice={ data.transaction.gasPrice }
                  gas={ data.transaction.gas }
                  from={ data.transaction.from }
                  to={ data.transaction.to }
                  value={ data.transaction.value || '0x0' }
                  msg={ data.msg }
                  status={ data.status }
                  error={ data.error }
                />
              )
            )
          }
        </div>
      </div>
    );
  }

  renderNoTransactionsMsg () {
    return (
      <div className={ styles.noTransactionsMsg }>
        <h3>There are no transactions requiring your confirmation.</h3>
      </div>
    );
  }

}
