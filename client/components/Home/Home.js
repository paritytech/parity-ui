import React from 'react';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';

import AppsList from '../AppsList';

import styles from './styles.css';

export default class Home extends React.Component {

  state = {
    isLoading: true,
    isError: false,
    apps: []
  };

  componentDidMount () {
    this.fetchApps();
  }

  fetchApps = () => {
    this.setState({
      isLoading: true,
      isError: false
    });

    window.fetch('/api/apps')
      .then(res => res.json())
      .then(apps => {
        this.setState({
          isLoading: false,
          isError: false,
          apps: apps
        });
      })
      .catch(err => {
        console.error(err);

        this.setState({
          isLoading: false,
          isError: true,
          apps: []
        });
      });
  }

  render () {
    return (
      <div className={styles.home}>
        {this.renderApps()}
      </div>
    );
  }

  renderApps () {
    if (this.state.isLoading) {
      return (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      );
    }
    if (this.state.isError) {
      return (
        <div className={styles.error}>
          <h1>Couldn't fetch apps.</h1>

          <a href='javascript:void' onClick={this.fetchApps} title='Try again'>
            <RefreshIndicator
              percentage={50}
              size={70}
              top={0}
              status='ready'
              style={{ position: 'static', margin: 'auto' }}
            />
          </a>
        </div>
      );
    }

    return (
      <AppsList apps={this.state.apps} />
    );
  }

}
