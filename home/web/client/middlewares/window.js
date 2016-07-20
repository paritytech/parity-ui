import { signerUrl } from '../utils/signer';

export default class WindowMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'open signer') {
        this.onOpenSigner(store);
        next(action);
        return;
      }
      next(action);
    };
  }

  onOpenSigner (store) {
    this.openTab(
      signerUrl(
        store.getState().rpc.signerPort
      )
    );
  }

  openTab (url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

}
