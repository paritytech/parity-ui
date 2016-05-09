/* global fetch */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateLogging } from '../../actions/logger';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './style.css';

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
    const {status} = this.props;
    return (
      <div className={style.normal}>
        <Header
          nodeName={status.name}
          disconnected={status.disconnected}
          noOfErrors={status.noOfErrors}
        />
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
        <Footer
          version={status.version}
          logging={this.props.logger.logging}
          updateLogging={this.props.actions.updateLogging}
          {...this._test('footer')}
        />
      </div>
    );
  }
}
AppListPage.propTypes = {
  logger: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired
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
