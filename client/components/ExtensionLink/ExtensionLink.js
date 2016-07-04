import React, { Component, PropTypes } from 'react';
import { CHROME_EXT_LINK } from '../../constants/constants';

import styles from './styles.css';

export default class ExtensionLink extends Component {

  static propTypes = {
    isInstalled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  isChrome = !!window.chrome && !!window.chrome.webstore;

  render () {
    const { isInstalled, isLoading } = this.props;
    if (!this.isChrome || isInstalled || isLoading) {
      return null;
    }

    return (
      <div className={ styles.link }>
        &nbsp;
        <a href={ CHROME_EXT_LINK } target='_blank'>
          Get Chrome Extension
        </a>
      </div>
    );
  }

}
