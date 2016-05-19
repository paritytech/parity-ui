import React, { Component, PropTypes } from 'react';

import Response from '../Response';
import styles from './style.css';

export default class Call extends Component {

  render () {
    const { call } = this.props;

    return (
      <div
        onMouseEnter={this.setParent}
        ref={this.setElement}
        className={styles.call}
        {...this._test(`call-${call.callNo}`)}
        >
        <span className={styles.callNo} {...this._test('callNo')}>#{call.callNo}</span>
        <pre {...this._test('name')}>{call.name}({call.params.toString()})</pre>
        <Response response={call.response} />
      </div>
    );
  }

  setElement = (el) => {
    this.element = el;
  }

  setParentHover = () => {
    this.props.setHoverChild(this.element, this.props.callIdx);
  }

  static propTypes = {
    call: PropTypes.object.isRequired,
    callIdx: PropTypes.number.isRequired,
    setHoverChild: PropTypes.func.isRequired
  }

}
