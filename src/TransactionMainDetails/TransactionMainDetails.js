import React, { Component, PropTypes } from 'react';

import ContractIcon from 'material-ui/svg-icons/action/code';
import ReactTooltip from 'react-tooltip';

import Account from '../Account';
import styles from './TransactionMainDetails.css';

export default class TransactionMainDetails extends Component {

  static propTypes = {
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.number.isRequired, // eth
    value: PropTypes.string.isRequired, // hex of wei
    ethValue: PropTypes.number.isRequired,
    totalEthValue: PropTypes.number.isRequired,
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
    const { from, to } = this.props;
    if (!to) {
      return;
    }
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } />
        </div>
        <div className={ styles.tx }>
          { this.renderEthValue() }
          <div>&rArr;</div>
          { this.renderEthTotalValue() }
        </div>
        <div className={ styles.to }>
          <Account address={ to } />
        </div>
      </div>
    );
  }

  renderContract () {
    const { from, to } = this.props;
    if (to) {
      return;
    }
    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <Account address={ from } />
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
    const { ethValue } = this.props;
    return (
      <div>
        <div
          data-tip
          data-for='ethValue'
          data-effect='solid'
          >
          <strong>{ ethValue } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id='ethValue'>
          The value of the transaction
        </ReactTooltip>
      </div>
    );
  }

  renderEthTotalValue () {
    const { totalEthValue } = this.props;
    return (
      <div>
        <div
          data-tip
          data-for='totalEthValue'
          data-effect='solid'
          className={ styles.total }>
          { totalEthValue } ETH
        </div>
        <ReactTooltip id='totalEthValue'>
          The value of the transaction including the mining fee. <br />
          This is the amount of ether you payed.
        </ReactTooltip>
      </div>
    );
  }

}
