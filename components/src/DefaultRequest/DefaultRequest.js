import React, { Component, PropTypes } from 'react';

import Account from '../Account';
import TransactionPendingForm from '../TransactionPendingForm';

// TODO [ToDr] Styles re-used
import styles from '../SignRequest/SignRequest.css';

export default class DefaultRequest extends Component {

  // TODO [todr] re-use proptypes?
  static propTypes = {
    id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    payload: PropTypes.any.isRequired,
    isFinished: PropTypes.bool.isRequired,
    chain: PropTypes.string.isRequired,
    balance: PropTypes.object,
    isSending: PropTypes.bool,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    status: PropTypes.string,
    className: PropTypes.string,
    result: PropTypes.string
  };

  render () {
    const className = this.props.className || '';
    return (
      <div className={ `${styles.container} ${className}` }>
        { this.renderDetails() }
        { this.renderActions() }
      </div>
    );
  }

  renderDetails () {
    const { isFinished, address, balance, chain, name, payload } = this.props;

    return (
      <div className={ styles.signDetails }>
        <div className={ styles.address }>
          <Account address={ address } balance={ balance } chain={ chain } />
        </div>
        <div className={ styles.info }>
          { isFinished ? '' : (
            <p>Unknown type of signing request. You might be using an old version of Signer.</p>
          ) }
          <p>
            <code className={ styles.raw }>{ name }</code>
            <textarea rows={ 5 } className={ styles.raw } readOnly>{ JSON.stringify(payload, null, 2) }</textarea>
          </p>
          { isFinished ? '' : (
            <p><strong>Confirm ONLY if you know what you are doing!</strong></p>
          ) }
        </div>
      </div>
    );
  }

  renderActions () {
    const { isFinished, status } = this.props;

    if (isFinished) {
      if (status === 'confirmed') {
        const { result } = this.props;

        return (
          <div className={ styles.actions }>
            <span className={ styles.isConfirmed }>Confirmed</span>
            <div>
              <p>Result:</p>
              <textarea className={ styles.raw } readOnly>{ result }</textarea>
            </div>
          </div>
        );
      }

      return (
        <div className={ styles.actions }>
          <span className={ styles.isRejected }>Rejected</span>
        </div>
      );
    }

    return (
      <TransactionPendingForm
        isSending={ this.props.isSending }
        onConfirm={ this.onConfirm }
        onReject={ this.onReject }
        className={ styles.actions }
        />
    );
  }

  onConfirm = password => {
    const { id } = this.props;
    this.props.onConfirm({ id, password });
  }

  onReject = () => {
    this.props.onReject(this.props.id);
  }

}
