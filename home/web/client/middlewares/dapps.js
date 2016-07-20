import logger from 'dapps-react-components/src/util/logger';
import { appLink } from '../utils/appLink';
import * as actions from '../actions/dapps';
import fetchApps from '../utils/fetchApps';
import { isEqual } from 'lodash';

export default class DappsMiddleware {

  toMiddleware () {
    return store => next => action => {
      if (action.type === 'init app') {
        this.onInitApp(store);
        next(action);
        return;
      }
      if (action.type === 'goto dapp') {
        this.onGotoDapp(action.payload);
        next(action);
        return;
      }
      next(action);
    };
  }

  onInitApp (store) {
    fetchApps()
      .then(dapps => {
        if (isEqual(store.getState().dapps, dapps)) {
          return;
        }
        store.dispatch(actions.updateDapps(dapps));
      })
      .catch(err => {
        logger.warn('error fetcing dapps ', err);
        store.dispatch(actions.error(err));
      });
  }

  onGotoDapp (id) {
    window.location = appLink(id);
  }

}
