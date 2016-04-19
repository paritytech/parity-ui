
import React, { Component, PropTypes } from 'react';

export default class EditableValue extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      editing: false,
      value: this.props.value
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.value === this.state.value) {
      return;
    }
    this.setState({
      value: newProps.value
    });
  }

  onChange (ev) {
    this.setState({
      value: ev.target.value
    });
  }

  onBlur (evt) {
    this.setState({
      editing: false
    });
    this.props.onSubmit(evt.target.value);
  }

  render () {
    return (
      <input
        type='text'
        value={this.state.value}
        onChange={::this.onChange}
        onBlur={::this.onBlur}
        />
    );
  }
}

EditableValue.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string
};
