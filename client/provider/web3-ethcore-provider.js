import Method from 'web3/lib/web3/method';
import formatters from 'web3/lib/web3/formatters';

const methods = [
  new Method({
    name: 'getExtraData',
    call: 'ethcore_extraData',
    params: 0
  }),
  new Method({
    name: 'getGasFloorTarget',
    call: 'ethcore_gasFloorTarget',
    params: 0,
    outputFormatter: formatters.outputBigNumberFormatter
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
