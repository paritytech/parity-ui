import React, { Component, PropTypes } from 'react';

import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import TransactionPendingFormConfirm from '../TransactionPendingFormConfirm';
import TransactionPendingFormReject from '../TransactionPendingFormReject';
import styles from './TransactionPendingForm.css';

export default class TransactionPendingForm extends Component {

  static propTypes = {
    isSending: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  state = {
    isRejectOpen: false
  };

  render () {
    const { isSending, onConfirm, onReject, className } = this.props;
    const Form = !this.state.isRejectOpen
      ? <TransactionPendingFormConfirm onConfirm={ onConfirm } isSending={ isSending } />
      : <TransactionPendingFormReject onReject={ onReject } />;
    return (
      <div className={ `${styles.container} ${className}` }>
        { Form }
        { this.renderRejectToggle() }
      </div>
    );
  }

  renderRejectToggle () {
    const { isRejectOpen } = this.state;
    let html;

    if (!isRejectOpen) {
      html = <span>reject</span>;
    } else {
      html = <span><BackIcon />I've changed my mind</span>;
    }

    return (
      <a
        onClick={ this.onToggleReject }
        className={ styles.rejectToggle }
      >
      { html }
      </a>
    );
  }

  onToggleReject = () => {
    const { isRejectOpen } = this.state;
    this.setState({ isRejectOpen: !isRejectOpen });
  }

}
