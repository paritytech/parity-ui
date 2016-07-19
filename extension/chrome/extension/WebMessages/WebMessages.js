import logger from '../../utils/logger';

export default class WebMessages {

  init () {
    chrome.runtime.onMessageExternal.addListener(this.onWebsiteMsg);
  }

  onWebsiteMsg (msg, sender, sendResponse) {
    logger.log('[WebMessages] incoming message:', msg, '; from: ', sender);
    if (msg !== 'version') {
      return;
    }
    sendResponse(
      chrome.runtime.getManifest().version
    );
  }

}
