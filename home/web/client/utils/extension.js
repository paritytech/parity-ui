import { CHROME_EXT_ID } from '../constants/extension';

export function fetchExtensionVersion (cb) {
  window.chrome.runtime.sendMessage(CHROME_EXT_ID, 'version', cb);
}

export function isChrome () {
  return !!window.chrome && !!window.chrome.webstore;
}
