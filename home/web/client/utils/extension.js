import { CHROME_EXT_ID } from '../constants/extension';

export function fetchIsExtensionInstalled (cb) {
  window.chrome.runtime.sendMessage(CHROME_EXT_ID, 'version', cb);
}
