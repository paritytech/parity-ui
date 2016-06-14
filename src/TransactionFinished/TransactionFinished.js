import React, { Component, PropTypes } from 'react';

import ReactTooltip from 'react-tooltip';
import AccountWeb3 from '../AccountWeb3';
import styles from './TransactionFinished.css';

export default class TransactionFinished extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    fee: PropTypes.number.isRequired,
    chain: PropTypes.string.isRequired,
    to: PropTypes.string, // undefined if it's a contract
    txHash: PropTypes.string, // undefined if it's rejected
    className: PropTypes.string,
    data: PropTypes.string
  };

  state = {
    totalValue: this.props.value + this.props.fee,
    txLink: this.getTxLink(this.props.txHash)
  };

  componentWillReceiveProps (nextProps) {
    this.updateTxLink(nextProps.txHash);
  }

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ `${styles.container} ${className || ''}` }>
        <div className={ styles.mainContainer }>
          { this.renderTransaction(from, to, value) }
          <div className={ styles.status }>
            { this.renderStatus() }
            { this.renderTxHash() }
          </div>
        </div>
      </div>
    );
  }

  renderTransaction (from, to, value) {
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <AccountWeb3 address={ from } />
        </div>
        <div className={ styles.tx }>
          { this.renderValue(value) }
          <div>&rArr;</div>
          { this.renderTotalValue() }
        </div>
        <div className={ styles.to }>
          <AccountWeb3 address={ to } />
        </div>
      </div>
    );
  }

  renderStatus () {
    const status = this.props.txHash ? 'Confirmed' : 'Rejected';
    const klass = this.props.txHash ? styles.isConfirmed : styles.isRejected;
    return (
      <div className={ klass }>{ status } </div>
    );
  }

  renderTxHash () {
    const { txHash } = this.props;
    const { txLink } = this.state;
    if (!txHash) {
      return null;
    }

    return (
      <div>
        <a href={ txLink } target='_blank'>{ txHash }</a>
      </div>
    );
  }

  getTxLink (txHash) {
    const base = this.props.chain === 'morden'
    ? 'https://testnet.etherscan.io/tx/'
    : 'https://etherscan.io/tx/';
    return base + txHash;
  }

  updateTxLink = (txHash) => {
    const txLink = this.getTxLink(txHash);
    this.setState({ txLink });
  };

  renderValue (value) {
    return (
      <div>
        <div
          data-tip
          data-for='value'
          data-effect='solid'
          >
          <strong>{ value } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id='value'>
          The value of the transaction
        </ReactTooltip>
      </div>
    );
  }

  renderTotalValue () {
    return (
      <div>
        <div
          data-tip
          data-for='totalValue'
          data-effect='solid'
          className={ styles.total }>
          { this.state.totalValue } ETH
        </div>
        <ReactTooltip id='totalValue'>
          The value of the transaction including the mining fee. <br />
          This is the amount of ether you payed.
        </ReactTooltip>
      </div>
    );
  }

}
