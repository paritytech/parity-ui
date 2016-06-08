import React, { Component, PropTypes } from 'react';
import { TransactionWeb3 } from 'dapps-react-ui';
import NotAuthorized from './NotAuthorized';
import styles from './MainSection.css';

export default class MainSection extends Component {

  static propTypes = {
    transactions: PropTypes.array.isRequired,
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

    if (!transactions.length) {
      return this.renderNoTransactionsMsg();
    }

    return (
      <div>

        {
          transactions.map(
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
          )
        }
      </div>
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
