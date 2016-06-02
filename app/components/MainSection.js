import React, { Component, PropTypes } from 'react';
import { TransactionWeb3 } from 'dapps-react-ui';
import styles from './MainSection.css';

export default class MainSection extends Component {

  static propTypes = {
    transactions: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions, transactions } = this.props;
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
}
