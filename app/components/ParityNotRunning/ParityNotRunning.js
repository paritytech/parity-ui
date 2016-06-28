import React, { Component, PropTypes } from 'react';

import styles from './ParityNotRunning.css';

import { isParityRunning } from '../../utils/parity';
import { isExtension } from '../../utils/extension';

export default class ParityNotRunning extends Component {

  static propTypes = {
    parityPath: PropTypes.string.isRequired,
    updateAppState: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.pollIsParityRunning();
  }

  componentWillUnMount () {
    clearTimeout(this.pollTimeout);
  }

  pollIsParityRunning = () => {
    isParityRunning(this.props.parityPath).then(isRunning => {
      if (isRunning) {
        window.location.reload();
        return;
      }
      this.pollTimeout = setTimeout(this.pollIsParityRunning, 5000);
    });
  }

  render () {
    return (
      <div className={ styles.container }>
        <p>
          To function correctly, this
          { isExtension() ? ' extension ' : ' app ' }
          needs you to run the Parity Ethereum client.
        </p>
        { this.renderInstallLink() }
      </div>
    );
  }

  renderInstallLink () {
    if (!isExtension()) {
      return;
    }
    return (
      <p className={ styles.install }>
        If you don't have Parity installed, get it <a href='https://github.com/ethcore/parity/releases' target='_blank'>here</a>.
      </p>
    );
  }

}
