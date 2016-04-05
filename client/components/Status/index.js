
import React, { Component, PropTypes } from 'react';

export default class Status extends Component {
  render () {
    return (
      <div className='dapp-flex-content'>
        <main className='dapp-content'>
          <div className='dapp-box'>
            <h2>Best Block</h2>
            <h1>#{this.props.status.bestBlock}</h1>
          </div>
          <div className='dapp-box'>
            <h2>Hash Rate</h2>
            <h1><span>{this.props.status.hashrate}</span></h1>
          </div>
        </main>

        <main className='dapp-content'>
          Nodename:
          Current:
            Best Block
            Hashrate
            Peers
            Pending Transactions
            Version

          Settings:
            Chain
            network:
              Port
              Peers
            Rpc?
              iface,port,cors,apis

          Mining Settings:
            Author
            Extradata
            mingasprice
            gas floor target

          Accounts:
        </main>
      </div>
    );
  }
}

Status.propTypes = {
  status: PropTypes.objectOf({
    bestBlock: PropTypes.string.isRequired,
    hashrate: PropTypes.string.isRequired
  })
};
