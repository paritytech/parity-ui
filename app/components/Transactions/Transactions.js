import React, { Component, PropTypes } from 'react';
import { TransactionWeb3 } from 'dapps-react-ui';
import FinishedTransactions from '../FinishedTransactions';
import styles from './Transactions.css';

export default class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.shape({
      pending: PropTypes.array.isRequired,
      finished: PropTypes.array.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      confirmTransaction: PropTypes.func.isRequired,
      rejectTransaction: PropTypes.func.isRequired
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
    return transactions.pending.map(
      data => (
        <TransactionWeb3
          className={ styles.transaction }
          rejectTransaction={ actions.rejectTransaction }
          confirmTransaction={ actions.confirmTransaction }
          key={ data.id }
          id={ data.id }
          data={ data.transaction.data }
          from={ data.transaction.from }
          to={ data.transaction.to }
          value={ data.transaction.value }
        />
      )
    );
  }

  renderFinishedTransactions () {
    return this.props.transactions.finished.map(
      data => (
        <FinishedTransactions
          className={ styles.transaction }
          txHash={ data.txHash }
          key={ data.id }
          id={ data.id }
          from={ data.transaction.from }
          to={ data.transaction.to }
          value={ data.transaction.value }
        />
      )
    );
  }

  renderNoTransactionsMsg () {
    return (
      <div className={ styles.noTransactionsMsg }>
        <h1>No transactions pending</h1>
      </div>
    );
  }

}
