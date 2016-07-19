import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AutoComplete from 'material-ui/AutoComplete';
import SearchIcon from 'material-ui/svg-icons/action/search';

import styles from './DappsNav.css';

import { gotoDapp } from '../../actions/dapps';

export default class DappsNav extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    dapps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      author: PropTypes.string,
      description: PropTypes.string,
      version: PropTypes.string
    })).isRequired,
    onOpen: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    gotoDapp: React.PropTypes.func.isRequired
  }

  state = {
    searchText: ''
  }

  componentDidMount () {
    document.addEventListener('keydown', this.onEsc);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onEsc);
  }

  render () {
    const isActiveclass = this.props.open ? styles.isActive : '';
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
        onClick={ this.toggle }
        className={ styles.searchIcon }
        title={ 'navigate to another dapp' }
        >
        <SearchIcon />
      </a>
    );
  }

  renderSearchBar () {
    const { open, dapps } = this.props;
    if (!open) {
      return;
    }

    const dappsNames = dapps.map(d => d.name);

    return (
      <AutoComplete
        name='DappsNavAutoComplete' // avoid Material Ui warning
        openOnFocus
        hintText='Search Dapps'
        onNewRequest={ this.onChooseDapp }
        onUpdateInput={ this.onUpdateInput }
        onBlur={ this.onBlur }
        filter={ this.filterSearch }
        dataSource={ dappsNames }
      />
    );
  }

  onBlur = () => {
    // Dont close when there is some searchText
    if (this.state.searchText) {
      return;
    }
    this.onClose();
  }

  onUpdateInput = searchText => {
    this.setState({ searchText });
  }

  focusAutoComplete = () => {
    const node = document.querySelector('[name=DappsNavAutoComplete]');
    ReactDOM.findDOMNode(node).focus();
  }

  onChooseDapp = name => {
    const { id } = this.props.dapps.find(d => d.name === name);
    this.props.gotoDapp(id);
  }

  toggle = () => {
    const { open } = this.props;
    if (!open) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  onOpen () {
    this.props.onOpen();
    setTimeout(() => {
      this.focusAutoComplete();
    });
  }

  onClose () {
    this.props.onClose();
  }

  filterSearch = (searchText, key) => {
    return searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }

  onEsc = evt => {
    if (evt.keyCode !== 27) {
      return;
    }
    this.onClose();
  }

}

function mapStateToProps (state) {
  return {
    dapps: state.dapps
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ gotoDapp }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DappsNav);
