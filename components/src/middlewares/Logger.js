import logger from '../util/logger';

export default class LoggerMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (store.getState().logger.logging) {
        const msg = [`[${this.now()}] action:`, `${action.type};`, 'payload: ', action.payload];
        // const logMethod = action.type.indexOf('error') > -1 ? 'error' : 'log';
        logger.log(...msg); // todo [adgo] - implement error logs
      }
      return next(action);
    };
  }

  now () {
    const date = new Date(Date.now());
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hour = date.getHours();
    return `${hour}::${minutes}::${seconds}`;
  }

}
