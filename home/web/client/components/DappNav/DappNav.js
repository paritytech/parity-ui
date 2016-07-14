import React from 'react';
import ReactDOM from 'react-dom';

import AutoComplete from 'material-ui/AutoComplete';
import SearchIcon from 'material-ui/svg-icons/action/search';

import styles from './DappNav.css';

import fetchApps from '../../utils/fetchApps';
import { appLink } from '../../utils/appLink';

export default class DappNav extends React.Component {
  state = {
    apps: [],
    appNames: []
  }

  componentDidMount () {
    this.fetchApps();
    document.addEventListener('keydown', this.onKeyPressedWhenActive);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyPressedWhenActive);
  }

  render () {
    const isActiveclass = this.state.active ? styles.isActive : '';
    return (
      <div className={ styles.container }>
        <div className={ `${styles.searchContainer} ${isActiveclass}` }>
          { this.renderSearchBar() }
        </div>
        { this.renderSearchIcon() }
      </div>
    );
  }

  renderSearchIcon () {
    return (
      <a
        onClick={ this.toggleActive }
        className={ styles.searchIcon }
        title={ 'navigate to another dapp' }
        >
        <SearchIcon />
      </a>
    );
  }

  renderSearchBar () {
    const { active, appNames } = this.state;
    if (!active) {
      return;
    }

    return (
      <AutoComplete
        name='DappNavAutoComplete' // avoid Material Ui warning
        openOnFocus
        hintText='Search Dapps'
        onNewRequest={ this.onChooseApp }
        onUpdateInput={ this.onUpdateInput }
        onBlur={ this.onBlur }
        filter={ this.filterSearch }
        dataSource={ appNames }
      />
    );
  }

  onBlur = () => {
    // Dont close when there is some searchText
    if (this.state.searchText) {
      return;
    }
    this.setActive(false);
  }

  onUpdateInput = searchText => {
    this.setState({ searchText });
  }

  focusAutoComplete = () => {
    const node = document.querySelector('[name=DappNavAutoComplete]');
    ReactDOM.findDOMNode(node).focus();
  }

  onChooseApp = name => {
    const app = this.state.apps.filter(app => app.name === name)[0];
    window.location = appLink(app.id);
  }

  toggleActive = () => {
    const { active } = this.state;
    this.setActive(!active);

    if (!active) {
      setTimeout(() => {
        this.focusAutoComplete();
      });
    }
  }

  filterSearch = (searchText, key) => {
    return searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }

  fetchApps = () => {
    this.setState({
      isLoading: true,
      isError: false
    });

    fetchApps()
      .then(apps => {
        this.setState({
          isLoading: false,
          isError: false,
          apps: apps,
          appNames: apps.map(app => app.name)
        });
      })
      .catch(err => {
        console.error(err);

        this.setState({
          isLoading: false,
          isError: true,
          apps: [],
          appNames: []
        });
      });
  }

  onKeyPressedWhenActive = evt => {
    if (evt.keyCode === 27) {
      this.setActive(false);
    }
  }

  setActive (val) {
    this.setState({ active: val });
    this.props.onSearchActive(val);
  }

  static propTypes = {
    onSearchActive: React.PropTypes.func.isRequired
  };

}
