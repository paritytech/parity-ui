import React from 'react';

import styles from './Identicon.css';

import * as blockies from 'exports?blockies!blockies/blockies';

export default class Identicon extends React.Component {

  state = {
    src: ''
  };

  componentDidMount () {
    this.updateIcon(this.props.seed);
  }

  componentWillReceiveProps (newProps) {
    if (newProps.seed === this.props.seed) {
      return;
    }
    this.updateIcon(newProps.seed);
  }

  updateIcon (seed) {
    const dataUrl = blockies.create({
      seed: seed,
      size: 8,
      scale: 8
    }).toDataURL();

    this.setState({
      src: dataUrl
    });
  }

  render () {
    return (
      <img src={ this.state.src } className={ styles.icon } />
    );
  }

  static propTypes = {
    seed: React.PropTypes.string.isRequired
  };
}
