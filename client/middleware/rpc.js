
// import {toPromise} from '../provider/util-provider';
import web3Formatters from 'web3/lib/web3/formatters.js';
import web3Utils from 'web3/lib/utils/utils.js';
import * as RpcActions from '../actions/rpc';
import RpcProvider from '../provider/rpc-provider';
const rpcProvider = new RpcProvider(web3Formatters, web3Utils);

export default class RpcMiddleware {

  constructor (request) {
    this._request = request;
  }

  toMiddleware () {
    return store => next => action => {
      if (action.type !== 'fire rpc') {
        return next(action);
      }

      const {method, inputFormatters, outputFormatter, params} = action.payload;
      const formattedParams = rpcProvider.formatParams(params, inputFormatters);
      // @TODO: convert to promise
      this._request(
        this.getOptions(method, formattedParams),
        this.responseHandler(store, method, params, outputFormatter)
      );
      return next(action);
    };
  }

  responseHandler (store, method, params, outputFormatter) {
    return (err, response, body) => {
      if (err) {
        return store.dispatch(RpcActions.error(err));
      }

      const result = rpcProvider.formatResult(body.result, outputFormatter);
      const addRpcResponseAction = RpcActions.addRpcReponse({
        name: method,
        params: params,
        response: result
      });
      store.dispatch(addRpcResponseAction);
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

}
