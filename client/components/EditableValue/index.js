
import React, { Component, PropTypes } from 'react';

import style from './styles.css';
import valueStyles from '../Value/styles.css';

export default class EditableValue extends Component {

  constructor (...args) {
    super(...args);
    this.state = {
      value: this.props.value,
      inEditMode: false
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.value === this.state.value || this.state.inEditMode) {
      return;
    }
    this.setState({
      value: newProps.value
    });
  }

  onChange (evt) {
    this.setState({
      value: evt.target.value
    });
  }

  onOpenEdit (evt) {
    this.setState({
      inEditMode: true
    });
  }

  onCancel (evt) {
    this.setState({
      inEditMode: false,
      value: this.props.value
    });
  }

  onSubmit () {
    this.setState({
      inEditMode: false
    });
    this.props.onSubmit(this.state.value);
  }

  onResetToDefault () {
    this.props.onSubmit(this.props.defaultValue);
  }

  render () {
    return (
      <div className={`${valueStyles.valueContainer} ${style.container}`}>
        {this.renderResetButton()}
        <div className={this.state.inEditMode ? style.iconsVisible : style.icons}>
          {this.props.children}
          {this.renderButtons()}
        </div>
        <input
          className={this.state.inEditMode ? style.input : valueStyles.value}
          type='text'
          value={this.state.value}
          onChange={::this.onChange}
          readOnly={!this.state.inEditMode}
          />
      </div>
    );
  }

  renderResetButton () {
    if (this.state.inEditMode) {
      return;
    }
    if (!this.props.defaultValue || this.state.value === this.props.defaultValue) {
      return;
    }

    return (
      <a
        key={'reset'}
        className={`${style.icon} ${style.firstIcon}`}
        onClick={::this.onResetToDefault}
        title={`Reset to ${this.props.defaultValue}`}
        >
        <i className='icon-anchor'></i>
      </a>
    );
  }

  renderButtons () {
    if (this.state.inEditMode) {
      return [
        <a
          key={'submit'}
          className={style.iconSuccess}
          onClick={::this.onSubmit}
          >
          <i className='icon-check'></i>
        </a>,
        <a
          key={'cancel'}
          className={style.icon}
          onClick={::this.onCancel}
          >
          <i className='icon-close'></i>
        </a>
      ];
    }

    return (
      <a
        key={'edit'}
        className={style.icon}
        onClick={::this.onOpenEdit}
        title='Edit'
        >
        <i className='icon-pencil'></i>
      </a>
    );
  }

}

EditableValue.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  children: PropTypes.element
};
