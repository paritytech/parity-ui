
import { createAction } from 'redux-actions';

export const error = createAction('error');
export const updateHashrate = createAction('update hashrate');
export const updateBlockNumber = createAction('update blockNumber');
export const updateVersion = createAction('update version');
export const updatePeerCount = createAction('update peerCount');
