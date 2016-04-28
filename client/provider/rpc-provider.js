
import rlp from 'rlp';

const version = 0x010000;
const separator = '/';

export default class RpcProvider {

  constructor (web3Utils, web3Formatters) {
    this._web3Utils = web3Utils;
    this._web3Formatters = web3Formatters;
  }

  formatResult (result, formatter) {
    if (!formatter) {
      return JSON.stringify(result);
    }

    // mostly we use web3Formatters (the last "else" case)
    // otherwise we use our own, or web3Utils
    if (formatter === 'decodeExtraData') {
      formatter = ::this.decode;
    } else if (formatter.indexOf('utils.') > -1) {
      formatter = this._web3Utils[formatter.split('.')[1]];
    } else {
      formatter = this._web3Formatters[formatter];
    }
    return `${formatter(result)}`;
  }

  formatParams (params, inputFormatters) {
    if (!inputFormatters || !inputFormatters.length) {
      return params;
    }

    return params.map((param, i) => {
      let formatter = inputFormatters[i];

      if (!formatter) {
        return param;
      }

      // mostly we use web3Formatters (the last "else" case)
      // otherwise we use our own, or web3Utils
      if (formatter === 'encodeExtraData') {
        formatter = ::this.encode;
      } else if (formatter.indexOf('utils.') > -1) {
        formatter = this._web3Utils[formatter.split('.')[1]];
      } else {
        formatter = this._web3Formatters[formatter];
      }

      return formatter(param);
    });
  }

  encode (str) {
    try {
      return `0x${rlp.encode([version].concat(str.split(separator))).toString('hex')}`;
    } catch (err) {
      console.error('error in encoding string: ', str, err);
      return '0xc5830100002d'; // encoding of '-'
    }
  }

  decode (str) {
    try {
      return rlp.decode(str).slice(1).join(separator);
    } catch (err) {
      console.error('error in decoding string: ', str, err);
      return '-';
    }
  }
}
