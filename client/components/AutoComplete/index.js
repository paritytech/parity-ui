import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

export default class WrappedAutoComplete extends Component {

  render () {
    return (
      <AutoComplete {...this.props} />
    );
  }

}

WrappedAutoComplete.propTypes = {
  filter: PropTypes.func
};

WrappedAutoComplete.defaultProps = {
  openOnFocus: true,
  filter: (searchText, key) => searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
};
