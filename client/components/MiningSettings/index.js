
import React, { Component, PropTypes } from 'react';

import EditableValue from '../EditableValue';

export default class MiningSettings extends Component {

  render () {
    const {mining, actions} = this.props;

    let onMinGasPriceChange = (newVal) => {
      actions.modifyMinGasPrice(+newVal);
    };

    let onExtraDataChange = (newVal) => {
      actions.modifyExtraData(newVal);
    };

    let onAuthorChange = (newVal) => {
      actions.modifyAuthor(newVal);
    };

    let onGasFloorTargetChange = (newVal) => {
      actions.modifyGasFloorTarget(+newVal);
    };

    return (
      <div>
        <h1><span>Mining</span> settings</h1>
        <h3>Author</h3>
        <EditableValue
          value={mining.author}
          onSubmit={onAuthorChange}/>
        <h3>Extradata</h3>
        <EditableValue
          value={mining.extraData}
          onSubmit={onExtraDataChange}
          defaultValue={this.getDefaultExtraData()}
          />
        <h3>Minimal Gas Price</h3>
        <EditableValue
          value={mining.minGasPrice}
          onSubmit={onMinGasPriceChange}/>
        <h3>Gas floor target</h3>
        <EditableValue
          value={mining.gasFloorTarget}
          onSubmit={onGasFloorTargetChange}/>
      </div>
    );
  }

  getDefaultExtraData () {
    return this.props.version.split('/').slice(0, 3).join('/');
  }

}

MiningSettings.propTypes = {
  version: PropTypes.string.isRequired,
  mining: PropTypes.shape({
    author: PropTypes.string.isRequired,
    extraData: PropTypes.string.isRequired,
    minGasPrice: PropTypes.string.isRequired,
    gasFloorTarget: PropTypes.string.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    modifyMinGasPrice: PropTypes.func.isRequired,
    modifyAuthor: PropTypes.func.isRequired,
    modifyGasFloorTarget: PropTypes.func.isRequired,
    modifyExtraData: PropTypes.func.isRequired,
    resetExtraData: PropTypes.func.isRequired
  }).isRequired
};
