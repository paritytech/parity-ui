import React, { Component, PropTypes } from 'react';

import ContractIcon from 'material-ui/svg-icons/action/code';
import ReactTooltip from 'react-tooltip';

import Account from '../Account';
import styles from './TransactionMainDetails.css';

export default class TransactionMainDetails extends Component {

  static propTypes = {
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.number.isRequired, // eth
    value: PropTypes.string.isRequired, // wei hex
    ethValue: PropTypes.number.isRequired,
    totalEthValue: PropTypes.number.isRequired,
    chain: PropTypes.string.isRequired,
    to: PropTypes.string, // undefined if it's a contract
    toBalance: PropTypes.number, // eth - undefined if it's a contract
    className: PropTypes.string
  };

  render () {
    const { className } = this.props;
    return (
      <div className={ className }>
        { this.renderTransfer() }
        { this.renderContract() }
      </div>
    );
  }

  renderTransfer () {
    const { from, fromBalance, to, toBalance, chain } = this.props;
    if (!to) {
      return;
    }
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } balance={ fromBalance } chain={ chain } />
        </div>
        <div className={ styles.tx }>
          { this.renderEthValue() }
          <div>&rArr;</div>
          { this.renderEthTotalValue() }
        </div>
        <div className={ styles.to }>
          <Account address={ to } balance={ toBalance } chain={ chain } />
        </div>
      </div>
    );
  }

  renderContract () {
    const { from, fromBalance, to, chain } = this.props;
    if (to) {
      return;
    }
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } balance={ fromBalance } chain={ chain } />
        </div>
        <div className={ styles.tx }>
          { this.renderEthValue() }
          <div>&rArr;</div>
          { this.renderEthTotalValue() }
        </div>
        <div className={ styles.contract }>
          <ContractIcon className={ styles.contractIcon } />
          <br />
          Contract
        </div>
      </div>
    );
  }

  renderEthValue () {
    const { ethValue, id } = this.props;
    return (
      <div>
        <div
          data-tip
          data-for={ 'ethValue' + id }
          data-effect='solid'
          >
          <strong>{ ethValue } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id={ 'ethValue' + id }>
          The value of the transaction
        </ReactTooltip>
      </div>
    );
  }

  renderEthTotalValue () {
    const { totalEthValue, id } = this.props;
    return (
      <div>
        <div
          data-tip
          data-for={ 'totalEthValue' + id }
          data-effect='solid'
          className={ styles.total }>
          { totalEthValue } ETH
        </div>
        <ReactTooltip id={ 'totalEthValue' + id }>
          The value of the transaction including the mining fee. <br />
          This is the amount of ether you payed.
        </ReactTooltip>
      </div>
    );
  }

}
