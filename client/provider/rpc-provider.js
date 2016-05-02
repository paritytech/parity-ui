
import rlp from 'rlp';

export default class RpcProvider {

  constructor (web3Utils, web3Formatters) {
    this._web3Utils = web3Utils;
    this._web3Formatters = web3Formatters;
  }

  formatResult (result, formatterName) {
    if (!formatterName) {
      return typeof result === 'object' ? result : String(result);
    }

    let formatter;

    // mostly we use web3Formatters (the last "else" case)
    // otherwise we use our own, or web3Utils
    if (formatterName === 'decodeExtraData') {
      formatter = ::this.decode;
    } else if (formatterName.indexOf('utils.') > -1) {
      formatter = this._web3Utils[formatterName.split('.')[1]];
    } else {
      formatter = this._web3Formatters[formatterName];
    }
    try {
      return `${formatter(result)}`;
    } catch (err) {
      const msg = `error using ${formatterName} on ${result}: ${err}`;
      console.error(msg);
      return new Error(msg);
    }
  }

  formatParams (params, inputFormatters) {
    if (!inputFormatters || !inputFormatters.length) {
      return params;
    }

    return params.map((param, i) => {
      let formatterName = inputFormatters[i];
      if (!formatterName) {
        return param;
      }

      let formatter;

      // mostly we use web3Formatters (the last "else" case)
      // otherwise we use our own, or web3Utils
      if (formatterName === 'encodeExtraData') {
        formatter = ::this.encode;
      } else if (formatterName.indexOf('utils.') > -1) {
        formatter = this._web3Utils[formatterName.split('.')[1]];
      } else {
        formatter = this._web3Formatters[formatterName];
      }

      try {
        return `${formatter(param)}`;
      } catch (err) {
        const msg = `error using ${formatterName} on ${param}: ${err}`;
        console.error(msg);
        return new Error(msg);
      }
    });
  }

  encode (str) {
    throw new Error('Unsupported');
  }

  decode (str) {
    try {
      const decoded = rlp.decode(str);
      const v = decoded[0];
      decoded[0] = decoded[1];
      decoded[1] = `${v[0]}.${v[1]}.${v[2]}`;
      return decoded.join('/');
    } catch (err) {
      console.error('error in decoding string: ', str, err);
      return str.match(/.{1,2}/g).map((v) => {
        return String.fromCharCode(parseInt(v, 16));
      }).join('');
    }
  }
}
