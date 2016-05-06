import React from 'react';
import styles from './styles.css';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import {Web3Component} from '../Web3Component/Web3Component';
import {Web3Forwarder} from './Web3Forwarder';

export class DappContent extends Web3Component {

  state = {
    sendingTransaction: false
  };

  constructor (...args) {
    super(...args);
    this.forwarder = new Web3Forwarder(this);
  }

  render () {
    const parts = this.props.url.split('://');
    const src = parts[0] === 'parity' ? parts[1] : this.props.url;

    return (
      <div>
        <iframe
          seamless
          className={styles.content}
          src={src}
          onLoad={(ev) => this.forwarder.onLoad(ev.target, this.props.url)}
          />
        <Dialog
          title='Confirm Transaction'
          actions={this.renderDialogActions()}
          modal
          open={this.state.sendingTransaction}
          >
          <pre>{JSON.stringify(this.state.transaction, null, 2)}</pre>
        </Dialog>
      </div>
    );
  }

  renderDialogActions () {
    return [
      <FlatButton
        label='Abort'
        secondary
        onTouchTap={::this.abortTransaction}
      />,
      <FlatButton
        label='Confirm'
        primary
        keyboardFocused
        onTouchTap={::this.confirmTransaction}
      />
    ];
  }

  abortTransaction () {
    this.state.cb('aborted');
    window.alert('Aborted!');
  }

  confirmTransaction () {
    this.state.cb(null, 'Pass');
    window.alert('Confirmed');
  }

  static propTypes = {
    url: React.PropTypes.string.isRequired,
    accounts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };
}
