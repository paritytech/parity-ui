
import React, { Component, PropTypes } from 'react';

export default class EditableInput extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      editing: false
    };
  }

  render () {
    let onClick = () => {
      this.setState({
        editing: true
      }, () => {
        this.refs.editInput.getDOMNode().value = this.props.value;
        this.refs.editInput.getDOMNode().focus();
      });
    };

    let onBlur = (evt) => {
      this.setState({
        editing: false
      });
      this.props.onSubmit.call(this, evt);
    };

    return (
      <div>
        {this.state.editing}
        <input type='text' style={this.state.editing ? {display: 'none'} : {}} value={this.props.value} onClick={onClick}/>
        <input type='text' style={!this.state.editing ? {display: 'none'} : {}} onBlur={onBlur} ref='editInput' />
      </div>
    );
  }
}

EditableInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.any
};
