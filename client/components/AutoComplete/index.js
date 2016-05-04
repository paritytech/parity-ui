import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

export default class WrappedAutoComplete extends Component {

  render () {
    return (
      <AutoComplete {...this.props} />
    );
  }

}

WrappedAutoComplete.defaultProps = {
  openOnFocus: true,
  filter: (searchText, key) => searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
};
