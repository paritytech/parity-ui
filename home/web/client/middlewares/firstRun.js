import { updateCreateAccount } from '../actions/createAccount';

export default class FirstRunMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'update isFirstRun') {
        this.onUpdateFirstRun(store, action.payload);
        next(action);
        return;
      }

      if (action.type === 'update accounts') {
        this.onUpdateAccounts(store, action.payload);
        next(action);
        return;
      }
    };
  }

  // check if rpc / is first run  ready
  onUpdateFirstRun (store, isFirstRun) {
    if (!isFirstRun ||
        !store.getState().rpc.isReady ||
        store.getState().rpc.accounts.length) {
      return;
    }
    store.dispatch(updateCreateAccount({ open: true }));
  }

  onUpdateAccounts (store, accounts) {
    if (accounts.length ||
        !store.getState().firstRun.isReady ||
        !store.getState().firstRun.isFirstRun) {
      return;
    }
    store.dispatch(updateCreateAccount({ open: true }));
  }

}
