
import React, { Component, PropTypes } from 'react';

import style from './style.css';

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
        this.refs.editInput.value = this.props.value;
        this.refs.editInput.focus();
      });
    };

    let onBlur = (evt) => {
      this.setState({
        editing: false
      });
      this.props.onSubmit.call(this, evt);
    };

    return (
      <div className={style.relative}>
        {this.state.editing}
        <input type='text' style={this.state.editing ? {display: 'none'} : {}} value={this.props.value} onClick={onClick}/>
        <input type='text' style={!this.state.editing ? {display: 'none'} : {}} onBlur={onBlur} ref='editInput' />
        {this.props.children}
      </div>
    );
  }
}

EditableInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.element,
  value: PropTypes.any
};
