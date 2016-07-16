import { updateIsDomReady } from '../actions/dom';

export default class DomProvider {

  constructor (store) {
    this.store = store;
  }

  init () {
    this.pollIsDomReady();
  }

  pollIsDomReady = () => {
    if (!document.body) {
      setTimeout(this.pollIsDomReady, 5);
      return;
    }
    this.store.dispatch(updateIsDomReady(true));
  }

}
