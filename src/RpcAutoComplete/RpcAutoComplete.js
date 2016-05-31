import React, { Component, PropTypes } from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import rpcMethods from 'ethereum-rpc-json';

export default class RpcAutoComplete extends Component {

  static propTypes = {
    onNewRequest: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    floatingLabelText: PropTypes.string,
    filter: PropTypes.func,
    openOnFocus: PropTypes.bool
  };

  static defaultProps = {
    filter: (searchText, key) => searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1,
    name: 'RpcAutoComplete', // avoid material ui key bug
    openOnFocus: true,
    floatingLabelText: 'Method name'
  };

  shouldComponentUpdate () {
    return false;
  }

  componentWillMount () {
    this.rpcMethodsNames = rpcMethods.map(m => m.name);
  }

  render () {
    return (
      <AutoComplete
        dataSource={ this.rpcMethodsNames }
        { ...this.props }
      />
    );
  }
}
