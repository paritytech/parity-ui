
import React, { Component, PropTypes } from 'react';

import style from './style.css';

export default class Debug extends Component {

  renderLogs () {
    return this.props.debug.logs.slice().reverse().map(log => (
      <pre className={style.log} key={log}>
        {log}
      </pre>
    ));
  }

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className={`dapp-content ${style.container}`}>
          <h1><span>Debugging</span> logs</h1>
          <h2>{this.props.debug.levels || '-'}</h2>
          <div className={style.logs}>
            {this.renderLogs()}
          </div>
        </main>
      </div>
    );
  }

}

Debug.propTypes = {
  debug: PropTypes.shape({
    levels: PropTypes.string.isRequired,
    logs: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  status: PropTypes.shape({
    name: PropTypes.string,
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired
  }).isRequired
};
