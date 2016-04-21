import Method from 'web3/lib/web3/method';
import formatters from 'web3/lib/web3/formatters';
import utils from 'web3/lib/utils/utils';
import RpcProvider from './rpc-provider';

const rpcProvider = new RpcProvider();

const methods = [
  new Method({
    name: 'getExtraData',
    call: 'ethcore_extraData',
    params: 0,
    outputFormatter: rpcProvider.decode
  }),
  new Method({
    name: 'setExtraData',
    call: 'ethcore_setExtraData',
    params: 1,
    inputFormatter: [rpcProvider.encode]
  }),
  new Method({
    name: 'getMinGasPrice',
    call: 'ethcore_minGasPrice',
    params: 0,
    outputFormatter: formatters.outputBigNumberFormatter
  }),
  new Method({
    name: 'setMinGasPrice',
    call: 'ethcore_setMinGasPrice',
    params: 1,
    inputFormatter: [utils.toHex]
  }),
  new Method({
    name: 'getGasFloorTarget',
    call: 'ethcore_gasFloorTarget',
    params: 0,
    outputFormatter: formatters.outputBigNumberFormatter
  }),
  new Method({
    name: 'setGasFloorTarget',
    call: 'ethcore_setGasFloorTarget',
    params: 1,
    inputFormatter: [utils.toHex]
  }),
  new Method({
    name: 'setAuthor',
    call: 'ethcore_setAuthor',
    params: 1,
    inputFormatter: [formatters.inputAddressFormatter]
  }),
  new Method({
    name: 'getDevLogs',
    call: 'ethcore_devLogs',
    params: 0
  }),
  new Method({
    name: 'getDevLogsLevels',
    call: 'ethcore_devLogsLevels',
    params: 0
  }),
  new Method({
    name: 'getNetChain',
    call: 'ethcore_netChain',
    params: 0
  }),
  new Method({
    name: 'getNetMaxPeers',
    call: 'ethcore_netMaxPeers',
    params: 0
  }),
  new Method({
    name: 'getNetPort',
    call: 'ethcore_netPort',
    params: 0
  }),
  new Method({
    name: 'getRpcSettings',
    call: 'ethcore_rpcSettings',
    params: 0
  })
];

class Ethcore {

  constructor (web3) {
    this._requestManager = web3._requestManager;

    methods.map((method) => {
      method.attachToObject(this);
      method.setRequestManager(this._requestManager);
    });
  }
}

export default Ethcore;
