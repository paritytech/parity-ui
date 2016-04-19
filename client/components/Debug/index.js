
import React, { Component, PropTypes } from 'react';
import bytes from 'bytes';

import style from './style.css';

export default class Debug extends Component {

  renderLogs () {
    let logs = this.props.logs.logs.slice().reverse();
    return logs.map(log => (
      <pre className={style.log} key={log}>{log}</pre>
    ));
  }

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className={`dapp-content ${style.container}`}>
          <h1><span>Debugging</span> logs</h1>
          <h2>{this.props.logs.levels ? this.props.logs.levels : '-'}</h2>
          <div className={style.logs}>
            {this.renderLogs()}
          </div>
        </main>
      </div>
    );
  }

}

Debug.propTypes = {
  logs: PropTypes.shape({
    levels: PropTypes.string.isRequired,
    logs: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  status: PropTypes.shape({
    name: PropTypes.string,
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired
  }).isRequired,
};
