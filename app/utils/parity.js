import axios from 'axios';
import logger from './logger';

export const isParityRunning = path => {
  console.log('[UTIL isParityRunning] path', path);
  try {
    return axios.get('http://' + path + '/index.html')
      .then(res => true)
      .catch(err => {
        console.warn('[UTIL Parity] err', err);
        return false;
      });
  } catch (err) {
    logger.warn('[UTIL Parity] err', err);
    return new Promise((resolve, reject) => resolve(false));
  }
};
