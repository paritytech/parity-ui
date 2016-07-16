import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { CHROME_EXT_LINK } from '../../constants/extension';

import styles from './ExtensionLink.css';

class ExtensionLink extends Component {

  static propTypes = {
    version: PropTypes.string.isRequired,
    isChrome: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  render () {
    const { version, isLoading, isChrome } = this.props;
    if (!isChrome || version.length || isLoading) {
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

function mapStateToProps (state) {
  const { version, isChrome, isLoading } = state.extension;
  return {
    version,
    isChrome,
    isLoading
  };
}

export default connect(
  mapStateToProps
)(ExtensionLink);
