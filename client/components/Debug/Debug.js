
import React, { Component, PropTypes } from 'react';

import style from './style.css';

class Debug extends Component {

  render () {
    return (
      <div className='dapp-flex-content'>
        <main className={`dapp-content ${style.container}`}>
          <div className={'dapp-container'}>
            <h1><span>Debugging</span> logs</h1>
            {this.renderActions()}
            <h2 className={style.subheader}>{this.props.debug.levels || '-'}</h2>
            <div className={style.logs}>
              {this.renderLogs()}
            </div>
          </div>
        </main>
      </div>
    );
  }

  renderLogs () {
    return this.props.debug.logs.slice().reverse().map((log, idx) => (
      <pre className={style.log} key={idx}>
        {log}
      </pre>
    ));
  }

  renderActions () {
    const toggleClass = this.props.debug.logging ? 'icon-control-pause' : 'icon-control-play';
    return (
      <div className={style.actions}>
        <a><i onClick={this.toggle} className={toggleClass}></i></a>
        <a><i onClick={this.clear} className='icon-trash'></i></a>
      </div>
    );
  }

  clear = () => {
    this.props.actions.removeDevLogs();
  }

  toggle = () => {
    this.props.actions.updateDevLogging(!this.props.debug.logging);
  }

}

Debug.propTypes = {
  actions: PropTypes.shape({
    removeDevLogs: PropTypes.func.isRequired,
    updateDevLogging: PropTypes.func.isRequired
  }).isRequired,
  debug: PropTypes.shape({
    levels: PropTypes.string.isRequired,
    logging: PropTypes.bool.isRequired,
    logs: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  status: PropTypes.shape({
    name: PropTypes.string,
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired,
    peers: PropTypes.number.isRequired
  }).isRequired
};

export default Debug;
