
import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

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

  onChange (value) {
    this.setState({
      value: value
    });
  }

  onOpenEdit (evt) {
    this.setState({
      inEditMode: true
    });

    if (!this._input) {
      return;
    }
    this._input.focus();
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
      <form
        className={`${valueStyles.valueContainer} ${style.container}`}
        onSubmit={::this.onSubmit}
        {...this._testInherit()}
        >
        {this.renderResetButton()}
        <div className={this.state.inEditMode ? style.iconsVisible : style.icons}>
          {this.props.children}
          {this.renderButtons()}
        </div>
        {this.renderInput()}
      </form>
    );
  }

  renderInput () {
    const { inEditMode, value } = this.state;

    if (!inEditMode || !this.props.autocomplete) {
      return (
        <input
          className={inEditMode ? style.input : valueStyles.value}
          type='text'
          value={value}
          onClick={::this.onOpenEdit}
          ref={el => this._input = el}
          onChange={(evt) => this.onChange(evt.target.value)}
          readOnly={!inEditMode}
          />
      );
    }

    return (
      <AutoComplete
        name='EditableValueAutoComplete' // avoid Material Ui warning
        className={style.autocomplete}
        fullWidth
        searchText={value}
        dataSource={this.props.dataSource}
        onUpdateInput={::this.onChange}
        onNewRequest={::this.onChange}
        openOnFocus
        filter={AutoComplete.noFilter}
      />
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
        {...this._testInherit('reset')}
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
          {...this._testInherit('submit')}
          >
          <i className='icon-check'></i>
        </a>,
        <a
          key={'cancel'}
          className={style.icon}
          onClick={::this.onCancel}
          {...this._testInherit('cancel')}
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
        {...this._testInherit('edit')}
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
  children: PropTypes.element,
  autocomplete: PropTypes.bool,
  dataSource: PropTypes.arrayOf(PropTypes.string)
};
