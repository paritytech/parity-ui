import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

export default class WrappedAutoComplete extends Component {

  render () {
    return (
      <AutoComplete
        openOnFocus={this.openOnFocus()}
        filter={this.filter()}
        {...this.props}
      />
    );
  }

  openOnFocus () {
    const { openOnFocus } = this.props;
    if (typeof openOnFocus === 'undefined') {
      return true;
    }

    return openOnFocus;
  }

  filter () {
    return this.props.filter || this.defaultFilter();
  }

  defaultFilter () {
    return (searchText, key) => searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }
}

WrappedAutoComplete.propTypes = {
  openOnFocus: PropTypes.bool,
  filter: PropTypes.func
};
