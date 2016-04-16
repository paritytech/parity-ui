
import request from 'browser-request';
// import utils from 'web3/lib/utils/utils';
import {outputBigNumberFormatter} from 'web3/lib/web3/formatters.js';

// import {toPromise} from '../provider/util-provider';
import ExtraDataManipulator from '../provider/extra-data-manipulator-provider';
import {updateRPCResponse} from '../actions/rpc';

const extraDataManipulator = new ExtraDataManipulator();

export default store => next => action => {
  if (action.type !== 'fire RPC') {
    return next(action);
  }

  const {method, inputFormatters, outputFormatter} = action.payload;
  const params = formatParams(action.payload.params, inputFormatters);
  // @TODO: convert to promise
  request(getOptions(method, params), (err, response, body) => {
    // @TODO: handle through store
    if (err) {
      console.error(err);
    }
    const result = formatResult(body.result, outputFormatter);
    const action = updateRPCResponse(result);
    store.dispatch(action);
  });
  return next(action);
};

export function getOptions (method, params) {
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

export function formatResult (result, formatter) {
  if (!formatter) {
    return `${result}`;
  }

  if (formatter === 'BigNumber') {
    formatter = outputBigNumberFormatter;
  }

  // @TODO: add rest of formatters
  return `${formatter(result)}`;
}

export function formatParams (params, inputFormatters) {
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
