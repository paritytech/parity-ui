import React, { Component } from 'react';
import { CHROME_EXT_ID, CHROME_EXT_LINK } from '../../constants/constants';

export default class ExtensionLink extends Component {

  isChrome = !!window.chrome && !!window.chrome.webstore;

  state = {
    isInstalled: true
  }

  componentWillMount () {
    this.updateIsInstalled();
  }

  render () {
    const { isInstalled } = this.state;
    if (!this.isChrome || isInstalled) {
      return null;
    }

    return (
      <div>
        <a href={ CHROME_EXT_LINK } target='_blank'>
          Get chrome extension
        </a>
      </div>
    );
  }

  updateIsInstalled () {
    window.chrome.runtime.sendMessage(
      CHROME_EXT_ID,
      'version',
      reply => {
        if (!reply) {
          this.setState({ isInstalled: false });
          return;
        }
      }
    );
  }

}
