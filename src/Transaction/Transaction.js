import React, { PropTypes } from 'react';

import TextField from 'material-ui/TextField';

// todo [adgo] - replace to Account without Web3
import AccountWeb3 from '../AccountWeb3';
import Web3Component from '../Web3Component';
import styles from './Transaction.css';

export default class Transaction extends Web3Component {

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

  state = {
    gasPrice: this.props.gasPrice,
    password: ''
  };

  render () {
    const { from, to, value, className } = this.props;
    return (
      <div className={ `${styles.container} ${className}` }>
        <div className={ styles.transaction }>
          <div className={ styles.from }>
            <AccountWeb3 address={ from } />
          </div>
          <div className={ styles.tx }>
            <span>&rArr;</span>
            <br />
            { this.renderValue(value) }
          </div>
          <div className={ styles.to }>
            <AccountWeb3 address={ to } />
          </div>
        </div>
        { this.renderInputs() }
        <div className={ styles.actions }>
          <a onClick={ this.reject } className={ styles.rejectButton }>Reject</a>
          <a onClick={ this.confirm } className={ styles.confirmButton }>Confirm</a>
        </div>
      </div>
    );
  }

  renderInputs () {
    return (
      <div className={ styles.actions }>
        <TextField
          onChange={ this.modifyPassword }
          name='password'
          floatingLabelText='password'
          type='password'
          value={this.state.password}
        />
        <TextField
          onChange={ this.modifyGasPrice }
          name='gasPrice'
          floatingLabelText='gas price'
          type='number'
          value={this.state.gasPrice}
        />
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

}
