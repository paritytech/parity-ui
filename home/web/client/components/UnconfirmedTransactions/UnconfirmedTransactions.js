import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { signerUrl } from '../../utils/signer';
import styles from './UnconfirmedTransactions.css';

class UnconfirmedTransaction extends Component {

  static propTypes = {
    signerPort: PropTypes.number.isRequired,
    unsignedTransactionsCount: PropTypes.number.isRequired
  }

  render () {
    const { signerPort, unsignedTransactionsCount } = this.props;

    if (!signerPort) {
      return null;
    }
    if (!unsignedTransactionsCount) {
      return (
        <div className={ styles.signerCount }></div>
      );
    }

    const port = signerPort;
    return (
      <div className={ styles.signerCount }>
        <a
          target={ '_signer' }
          href={ signerUrl(port) }
          title={ `There are ${unsignedTransactionsCount} transactions awaiting your confirmation.` }
        >
          <span>
            { unsignedTransactionsCount }
          </span>
        </a>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { signerPort, unsignedTransactionsCount } = state.rpc;
  return {
    signerPort, unsignedTransactionsCount
  };
}

export default connect(
  mapStateToProps
)(UnconfirmedTransaction);
