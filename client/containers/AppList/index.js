/* global fetch */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './style.css';

class AppList extends Component {
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
      .then((res) => res.json())
      .then((data) => this.setState({
        apps: data
      }));
  }

  renderApps () {
    if (!this.state.apps) {
      return;
    }
    return this.state.apps.map((app) => (
      <li>
        <a href={`/${app}/`}>{app}</a>
      </li>
    ));
  }

  render () {
    return (
      <div className={style.normal}>
        <Header nodeName={this.props.status.name} />
        <div className='dapp-flex-content'>
          <main className='dapp-content'>
            <h1>List of installed apps</h1>
            <ul>
            {this.renderApps()}
            </ul>
          </main>
        </div>
        <Footer version={this.props.status.version} />
      </div>
    );
  }
}
AppList.propTypes = {
  status: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return state;
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppList);
