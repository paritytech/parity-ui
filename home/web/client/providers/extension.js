import { updateExtensionVersion } from '../actions/extension';
import { fetchExtensionVersion } from '../utils/extension';

export default class ExtensionProvider {

  constructor (store) {
    this.store = store;
  }

  init () {
    this.pollVersion();
  }

  pollVersion = () => {
    const { isChrome, version } = this.store.getState().extension;
    if (!isChrome || version.length) {
      return;
    }
    fetchExtensionVersion(version => {
      version = this.formatVersion(version);
      this.store.dispatch(updateExtensionVersion(version));
      if (version.length) {
        return;
      }
      setTimeout(this.pollVersion, 10000);
    });
  }

  formatVersion (version) {
    // TODO [adgo] - temp hack until extension is updated
    // to return only version, instead of { version: version }
    if (version.version) {
      return version.version;
    }
    return version || ''; // if extension isn't installed response would be null/undefined
  }

}