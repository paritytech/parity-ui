import React, { Component, PropTypes } from 'react';

import Response from '../Response';
import styles from './style.css';

export default class Call extends Component {

  render () {
    const { call } = this.props;

    return (
      <div
        onMouseEnter={this.setParentIdx}
        ref={this.setParentElement}
        className={styles.call}
        {...this._test(`call-${call.callNo}`)}
        >
        <span className={styles.callNo} {...this._test('callNo')}>#{call.callNo}</span>
        <pre {...this._test('name')}>{call.name}({call.params.toString()})</pre>
        <Response response={call.response} />
      </div>
    );
  }

  setParentElement = (el) => {
    this.props.setCallElement(this.props.callIdx, el);
  }

  setParentIdx = () => {
    this.props.setHoverIdx(this.props.callIdx);
  }

  static propTypes = {
    call: PropTypes.object.isRequired,
    callIdx: PropTypes.Number.isRequired,
    setCallElement: PropTypes.func.isRequired,
    setHoverIdx: PropTypes.func.isRequired
  }

}
