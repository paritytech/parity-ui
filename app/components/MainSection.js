import React, { Component, PropTypes } from 'react';
import { TransactionWeb3 } from 'dapps-react-ui';
import NotAuthorized from './NotAuthorized';
import styles from './MainSection.css';

class FinishedTransaction extends Component {
  render () {
    return (
      <div>
        This is a finished Transaction:
        ID: { this.props.id }
        FROM: { this.props.from }
      </div>
    );
  }
}

export default class MainSection extends Component {

  static propTypes = {
    transactions: PropTypes.shape({
      finished: PropTypes.array.isRequired, // todo [adgo] - specify
      pending: PropTypes.array.isRequired // todo [adgo] - specify
    }).isRequired,
    actions: PropTypes.object.isRequired,
    ws: PropTypes.shape({
      isConnected: PropTypes.bool.isRequired,
      token: PropTypes.string.isRequired
    }).isRequired
  };

  render () {
    const { actions, transactions, ws } = this.props;
    if (!ws.isConnected) {
      return <NotAuthorized token={ ws.token } submit={ actions.submitToken } />;
    }

    if (!ws.isConnected) {
      return this.renderNotConnected();
    }

    if (!transactions.pending.length && !transactions.finished.length) {
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
          from={ data.transaction.from }
          to={ data.transaction.to }
          value={ data.transaction.value }
        />
      )
    );
  }

  renderFinishedTransactions () {
    return this.props.transactions.finished.map(
      t => <FinishedTransaction key={ t.id } { ...t } />
    );
  }

  renderNotConnected () {
    return (
      <h1>Not Connected</h1>
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
