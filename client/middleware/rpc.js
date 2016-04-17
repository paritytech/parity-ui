

// import utils from 'web3/lib/utils/utils';
import web3Formatters from 'web3/lib/web3/formatters.js';
import web3Utils from 'web3/lib/utils/utils.js';

// import {toPromise} from '../provider/util-provider';
import ExtraDataManipulator from '../provider/extra-data-manipulator-provider';
import * as RPCActions from '../actions/rpc';

const extraDataManipulator = new ExtraDataManipulator();

export default class RPCMiddleware {

  constructor (request) {
    this._request = request;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'fire RPC') {
        return next(action);
      }

      const {method, inputFormatters, outputFormatter} = action.payload;
      const params = this.formatParams(action.payload.params, inputFormatters);
      // @TODO: convert to promise
      this._request(::this.getOptions(method, params), (err, response, body) => {
        if (err) {
          return store.dispatch(RPCActions.error(err));
        }
        const result = this.formatResult(body.result, outputFormatter);
        const unshiftRpcResponsePayload = { name: method, params: action.payload.params, response: result };
        const unshiftRpcResponseAction = RPCActions.unshiftRPCReponse(unshiftRpcResponsePayload);
        store.dispatch(unshiftRpcResponseAction);
      });
      return next(action);
    };
  }

  getOptions (method, params) {
    return {
      url: '/rpc/',
      method: 'POST',
      json: {
        id: 1000,
        method: method,
        jsonrpc: '2.0',
        params: params
      }
    };
  }

  formatResult (result, formatter) {
    if (!formatter) {
      return `${result}`;
    }

    // mostly we use web3Formatters (the last "else" case)
    // otherwise we use our own, or web3Utils
    // @TODO :: impement our formatters with a convention (currenty we have only extraDataManipulator as a formatter)
    if (formatter === 'decodeExtraData') {
      formatter = extraDataManipulator.decode;
    } else if (formatter.indexOf('utils.') > -1) {
      formatter = web3Utils[formatter.split('.')[1]];
    } else {
      formatter = web3Formatters[formatter];
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
      // @TODO :: impement our formatters with a convention (currenty we have only extraDataManipulator as a formatter)
      if (formatter === 'encodeExtraData') {
        formatter = extraDataManipulator.encode;
      } else if (formatter.indexOf('utils.') > -1) {
        formatter = web3Utils[formatter.split('.')[1]];
      } else {
        formatter = web3Formatters[formatter];
      }

      return formatter(param);
    });
  }
}
