/* global fetch */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateLogging } from '../../actions/logger';

class AppListPage extends Component {
  constructor (...args) {
    super(...args);
    this.state = {
      apps: []
    };
  }

  componentDidMount () {
    // TODO [todr] move to state
    fetch('/api/apps', {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => this.setState({
        apps: data
      }));
  }

  renderApps () {
    const filteredApps = this.state.apps.filter(app => ['status', 'rpc'].indexOf(app) === -1);

    if (!filteredApps.length) {
      return <h3>This parity instance has been compiled without additional apps.</h3>;
    }

    return filteredApps.map((app) => {
      return (
        <li key={app}>
          <a target='blank' href={`/${app}/`}>{app} (beta)</a>
        </li>
      );
    });
  }

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className='dapp-content'>
          <div className={'dapp-container'}>
            <h1><span>Installed</span> apps</h1>
            <ul>
            {this.renderApps()}
            </ul>
          </div>
        </main>
      </div>
    );
  }
}

AppListPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({updateLogging}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppListPage);
