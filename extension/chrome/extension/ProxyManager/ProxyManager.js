import logger from '../../utils/logger';

// get proxy settings
// if settings equals target, break
// else, set proxy settings

export default class ProxyManager {

  constructor () {
    this.targetPacFileUrl = 'http://localhost:8080/proxy/proxy.pac';
  }

  init () {
    chrome.proxy.settings.get({}, details => {
      logger.log('[BG PROXY] proxy details: ', details);
      if (this.alreadyConfigured(details.value)) {
        return logger.log('[BG PROXY] proxy is already configured at: ', this.targetPacFileUrl);
      }

      logger.log('[BG PROXY] configuring proxy to use PacFile from: ', this.targetPacFileUrl);

      const value = {
        mode: 'pac_script',
        pacScript: {
          url: this.targetPacFileUrl
        }
      };

      chrome.proxy.settings.set({
        value
      }, () => {
        logger.log('[BG PROXY] proxy set!');
      });
    });
  }

  alreadyConfigured (value) {
    const { pacScript } = value;
    return pacScript && pacScript.url === this.targetPacFileUrl;
  }
}
