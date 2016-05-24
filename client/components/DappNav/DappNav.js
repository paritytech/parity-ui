import React from 'react';
import ReactDOM from 'react-dom';

import AutoComplete from 'material-ui/AutoComplete';
import SearchIcon from 'material-ui/svg-icons/action/search';

import styles from './DappNav.css';
import { appLink } from '../appLink';

export default class DappNav extends React.Component {
  state = {
    apps: []
  }

  componentDidMount () {
    this.fetchApps();
  }

  render () {
    const isActiveclass = this.state.active ? styles.isActive : '';
    return (
      <div className={styles.container}>
        <div className={`${styles.searchContainer} ${isActiveclass}`}>
          {this.renderSearchBar()}
        </div>
        {this.renderSearchIcon()}
      </div>
    );
  }

  renderSearchIcon () {
    return (
      <a
        onClick={this.toggleActive}
        className={styles.searchIcon}
        title={'navigate to another dapp'}
        >
        <SearchIcon />
      </a>
    );
  }

  renderSearchBar () {
    const { active, apps } = this.state;
    if (!active) {
      return;
    }

    // without this hack the menu isn't aligned properly
    setTimeout(this.focusAutoComplete, 0);

    return (
      <AutoComplete
        name='DappNavAutoComplete' // avoid Material Ui warning
        openOnFocus
        hintText='Pick a dapp to navigate to'
        onNewRequest={this.onChooseApp}
        filter={this.filterSearch}
        dataSource={apps}
      />
    );
  }

  focusAutoComplete = () => {
    const node = document.querySelector('[name=DappNavAutoComplete]');
    ReactDOM.findDOMNode(node).focus();
  }

  onChooseApp (name) {
    window.location = appLink(name);
  }

  toggleActive = (asdasd, asd) => {
    const { active } = this.state;
    this.setState({active: !active});
  }

  filterSearch = (searchText, key) => {
    return searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
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
          apps: this.filterApps(apps).map((app) => app.id)
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

}
