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
      if (version) {
        this.store.dispatch(updateExtensionVersion(version));
        return;
      }
      setTimeout(this.pollVersion, 10000);
    });
  }

  formatVersion (version) {
    // TODO [adgo] - temp hack until extension is updated
    // to return only version, instead of { version: version }
    try {
      return version.version;
    } catch (err) {
      return version;
    }
  }

}
