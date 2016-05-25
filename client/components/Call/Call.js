import React, { Component, PropTypes } from 'react';

import Response from '../Response';
import styles from './style.css';

export default class Call extends Component {

  render () {
    let { callNo, name, params, response } = this.props.call;
    params = this.formatParams(params);
    return (
      <div
        onMouseEnter={this.setActiveCall}
        ref={this.setElement}
        className={styles.call}
        {...this._test(`call-${callNo}`)}
        >
        <span className={styles.callNo} {...this._test('callNo')}>#{callNo}</span>
        <pre {...this._test('name')}>{name}({params})</pre>
        <Response response={response} />
      </div>
    );
  }

  setElement = (el) => {
    this.element = el;
  }

  setActiveCall = () => {
    this.props.setActiveCall(this.props.call, this.element);
  }

  formatParams (params) {
    return JSON.stringify(params).slice(1, -1);
  }

  static propTypes = {
    call: PropTypes.object.isRequired,
    setActiveCall: PropTypes.func.isRequired
  }

}
