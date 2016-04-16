

// import utils from 'web3/lib/utils/utils';
import {outputBigNumberFormatter} from 'web3/lib/web3/formatters.js';

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
        const pushRpcResponsePayload = { name: method, params: action.payload.params, response: result };
        const pushRpcResponseAction = RPCActions.unshiftRPCReponse(pushRpcResponsePayload);
        store.dispatch(pushRpcResponseAction);
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

    if (formatter === 'BigNumber') {
      formatter = outputBigNumberFormatter;
    }

    // @TODO: add rest of formatters
    return `${formatter(result)}`;
  }

  formatParams (params, inputFormatters) {
    if (!inputFormatters || !inputFormatters.length) {
      return params;
    }

    return params.map(param => {
      inputFormatters.forEach(formatter => {
        if (formatter === 'encodeExtraData') {
          formatter = extraDataManipulator.encode;
        }
        // @TODO: add rest of formatters
        param = formatter(param);
      });
      return param;
    });
  }
}
