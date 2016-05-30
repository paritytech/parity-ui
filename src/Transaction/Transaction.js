import React, { PropTypes } from 'react';

import Account from '../Account';
import Web3Component from '../Web3Component';
import styles from './Transaction.css';

export default class Transaction extends Web3Component {

  state = {
    gasPrice: this.props.gasPrice
  }

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ `${styles.container} ${className}` }>
        <div className={ styles.transaction }>
          <div className={ styles.from }>
            <Account address={ from } />
          </div>
          <div className={ styles.tx }>
            <span>&rArr;</span>
            <br />
            { this.renderValue(value) }
          </div>
          <div className={ styles.to }>
            <Account address={ to } />
          </div>
        </div>
        <div className={ styles.actions }>
          <a onClick={ this.reject } className={ styles.rejectButton }>Reject</a>
          <a onClick={ this.confirm } className={ styles.confirmButton }>Confirm</a>
        </div>
      </div>
    );
  }

  modifyPassword = (evt) => {
    this.setState({ password: evt.target.value });
  }

  modifyGasPrice = (evt) => {
    this.setState({ gasPrice: evt.target.value });
  }

  confirm = () => {
    const { password, gasPrice } = this.state;
    this.props.confirmTransaction({
      id: this.props.id,
      password, gasPrice
    });
  }

  reject = () => {
    this.props.rejectTransaction(this.props.id);
  }

  renderValue (value) {
    value = this.context.web3.fromWei(value);
    return (
      <div>
        <strong style={ { display: 'block' } }>{ value }</strong>
        <span>Eth</span>
      </div>
    );
  }

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.number.isRequired,
    from: PropTypes.string.isRequired,
    gasPrice: PropTypes.any,
    gas: PropTypes.any,
    to: PropTypes.string.isRequired,
    nonce: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    confirmTransaction: PropTypes.func.isRequired,
    rejectTransaction: PropTypes.func.isRequired
  }

}
