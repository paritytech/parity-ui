
import React, { Component, PropTypes } from 'react';

import style from './styles.css';
import valueStyles from '../Value/styles.css';

export default class EditableValue extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
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
    this.props.onSubmit(evt.target.value);
  }

  render () {
    return (
      <div className={valueStyles.valueContainer}>
        <input
          className={style.value}
          type='text'
          value={this.state.value}
          onChange={::this.onChange}
          onBlur={::this.onBlur}
          />
        {this.props.children}
      </div>
    );
  }
}

EditableValue.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string,
  children: PropTypes.element
};
