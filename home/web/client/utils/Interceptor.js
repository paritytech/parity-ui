export default class Interceptor {

  constructor (provider) {
    this.provider = provider;
    this.interceptions = {};
  }

  intercept (rpcMethodName, handler) {
    this.interceptions[rpcMethodName] = this.interceptions[rpcMethodName] || [];
    const i = this.interceptions[rpcMethodName];
    i.push(handler);

    return () => {
      const idx = i.indexOf(handler);
      if (idx === -1) {
        return;
      }
      i.splice(i.indexOf(handler), 1);
    };
  }

  handle (payload, cb, next) {
    const { method } = payload;
    const handlers = this.interceptions[method];

    if (!handlers || !handlers.length) {
      return next();
    }

    return handlers.reduce((ret, handler) => {
      if (ret) {
        return ret;
      }
      return handler(payload, cb, next);
    }, false);
  }

  // HTTP Provider methods (probably should be returned when `intoProvider` is called or something)
  prepareRequest (async) {
    return this.provider.prepareRequest(async);
  }

  send (payload) {
    const next = cb2 => {
      const ret = this.provider.send(payload);
      cb2 && cb2(null, ret);
      return ret;
    };
    return this.handle(payload, false, next);
  }

  sendAsync (payload, callback) {
    const next = cb2 => {
      return this.provider.sendAsync(payload, (...args) => {
        cb2 && cb2(...args);
        return callback(...args);
      });
    };
    return this.handle(payload, callback, next);
  }

  isConnected () {
    return this.provider.isConnected();
  }

}
