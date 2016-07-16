import logger from '../util/logger';

export default class LoggerMiddleware {

  toMiddleware () {
    return store => next => action => {
      const msg = [`[${this.now()}] action:`, `${action.type};`, 'payload: ', action.payload];
      if (action.type.match('error')) {
        logger.warn(...msg); // todo [adgo] - implement error logs
      } else {
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
