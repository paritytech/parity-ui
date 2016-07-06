import React, { Component } from 'react';
import { CHROME_EXT_ID, CHROME_EXT_LINK } from '../../constants/constants';

import styles from './styles.css';

export default class ExtensionLink extends Component {

  isChrome = !!window.chrome && !!window.chrome.webstore;

  state = {
    loading: true,
    isInstalled: false
  }

  componentWillMount () {
    this.updateIsInstalled();
  }

  componentWillUnmount () {
    clearTimeout(this.isInstalledTimeout);
  }

  render () {
    const { isInstalled, loading } = this.state;
    if (!this.isChrome || isInstalled || loading) {
      return null;
    }

    return (
      <div className={styles.link}>
        &nbsp;
        <a href={ CHROME_EXT_LINK } target='_blank'>
          Get Chrome Extension
        </a>
      </div>
    );
  }

  updateIsInstalled = () => {
    if (!this.isChrome || this.state.isInstalled) {
      return;
    }
    window.chrome.runtime.sendMessage(
      CHROME_EXT_ID,
      'version',
      reply => {
        if (!reply) {
          this.setState({ isInstalled: false, loading: false });
          this.isInstalledTimeout = setTimeout(this.updateIsInstalled, 10000);
          return;
        }
        this.setState({ isInstalled: true, loading: false });
      }
    );
  }

}
