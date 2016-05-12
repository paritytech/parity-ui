import React, { Component, PropTypes } from 'react';
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

WrappedAutoComplete.propTypes = {
  dataSource: PropTypes.array.isRequired,
  filter: PropTypes.func,
  name: PropTypes.string.isRequired,
  openOnFocus: PropTypes.bool
};

WrappedAutoComplete.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
