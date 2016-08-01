import React, { Component, PropTypes } from 'react';
import { TransactionPendingWeb3, TransactionFinishedWeb3 } from 'dapps-react-components';
import styles from './Transactions.css';

export default class Transactions extends Component {

  static propTypes = {
    requests: PropTypes.shape({
      pending: PropTypes.array.isRequired,
      finished: PropTypes.array.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      startConfirmRequest: PropTypes.func.isRequired,
      startRejectRequest: PropTypes.func.isRequired
    }).isRequired
  };

  render () {
    const { pending, finished } = this.props.requests;

    if (!pending.length && !finished.length) {
      return this.renderNoRequestsMsg();
    }

    return (
      <div>
        { this.renderFinishedRequests() }
        { this.renderPendingRequests() }
      </div>
    );
  }

  renderPendingRequests () {
    const { actions, requests } = this.props;
    if (!requests.pending.length) {
      return;
    }
    return (
      <div>
        <h2>Pending Requests</h2>
        <div>
          {
            requests.pending.filter(tx => tx.payload.transaction).map(
              data => (
                <TransactionPendingWeb3
                  className={ styles.transaction }
                  onConfirm={ actions.startConfirmRequest }
                  onReject={ actions.startRejectRequest }
                  isSending={ data.isSending || false }
                  key={ data.id }
                  id={ data.id }
                  gasPrice={ data.payload.transaction.gasPrice }
                  gas={ data.payload.transaction.gas }
                  data={ data.payload.transaction.data }
                  from={ data.payload.transaction.from }
                  to={ data.payload.transaction.to }
                  value={ data.payload.transaction.value || '0x0' }
                />
              )
            )
          }
        </div>
      </div>
    );
  }

  renderFinishedRequests () {
    const { finished } = this.props.requests;
    if (!finished.length) {
      return;
    }
    return (
      <div>
        <h2>Finished Requests</h2>
        <div>
          {
            finished.filter(tx => tx.payload.transaction).map(
              data => (
                <TransactionFinishedWeb3
                  className={ styles.transaction }
                  txHash={ data.txHash }
                  key={ data.id }
                  id={ data.id }
                  gasPrice={ data.payload.transaction.gasPrice }
                  gas={ data.payload.transaction.gas }
                  from={ data.payload.transaction.from }
                  to={ data.payload.transaction.to }
                  value={ data.payload.transaction.value || '0x0' }
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

  renderNoRequestsMsg () {
    return (
      <div className={ styles.noRequestsMsg }>
        <h3>There are no requests requiring your confirmation.</h3>
      </div>
    );
  }

}
