import React from 'react';

import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import CircularProgress from 'material-ui/CircularProgress';

import AppsList from '../AppsList';
import SubdomainDialog from '../SubdomainDialog';

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

  filterApps (apps) {
    // We are going to filter apps with the same
    // names, versions and descriptions.
    // We are also getting rid of `home.parity` app.
    
    const known = {};
    return apps.filter(app => {
      const uid = app.name + app.version + app.description;

      if (app.id === 'home') {
        return false;
      }

      if (known[uid]) {
        known[uid].ids.push(app.id);
        return false;
      }

      known[uid] = app;
      app.ids = [app.id];
      return true;
    });
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
          apps: this.filterApps(apps)
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
      <div>
        <AppsList apps={this.state.apps} />
        <SubdomainDialog>
          {this.renderSubdomainInfo()}
        </SubdomainDialog>
      </div>
    );
  }

  renderSubdomainInfo () {
    return (
      <h3 className={styles.alert}>
        <ReportProblem />
        We recommend configuring <code>http://home.parity/</code> address for your parity node. Learn more.
      </h3>
    );
  }

}
