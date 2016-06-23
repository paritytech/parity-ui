import React, { Component, PropTypes } from 'react';

import styles from './ParityNotRunning.css';

import { isParityRunning } from '../../utils/parity';

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
      this.pollTimeout = setTimeout(this.pollIsParityRunning, 2000);
    });
  }

  render () {
    const { parityPath } = this.props;
    return (
      <div className={ styles.container }>
        <h1>Please make sure your parity node is running on { parityPath }</h1>
      </div>
    );
  }

}
