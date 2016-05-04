
import React from 'react';
import styles from './styles.css';

export class DappContent extends React.Component {

  render () {
    return (
      <iframe
        seamless
        className={styles.content}
        src={'dapp.html'}
        />
    );
  }
}
