/* global chrome */

// get proxy settings
// if settings equals target, break
// else, set proxy settings

class ProxyManager {

  constructor () {
    this.targetPacFileUrl = 'http://localhost:8080/proxy/proxy.pac';
  }

  onInit () {
    chrome.proxy.settings.get({}, details => {
      console.log('[BG PROXY] proxy details: ', details);
      if (this.alreadyConfigured(details.value)) {
        return console.log('[BG PROXY] proxy is already configured at: ', this.targetPacFileUrl);
      }

      console.log('[BG PROXY] configuring proxy to use PacFile from: ', this.targetPacFileUrl);

      const value = {
        mode: 'pac_script',
        pacScript: {
          url: this.targetPacFileUrl
        }
      };

      chrome.proxy.settings.set({
        value
      }, () => {
        console.log('[BG PROXY] proxy set!');
      });
    });
  }

  alreadyConfigured (value) {
    const { pacScript } = value;
    return pacScript && pacScript.url === this.targetPacFileUrl;
  }
}

const proxyManager = new ProxyManager();

proxyManager.onInit();
