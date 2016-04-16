
import { createAction } from 'redux-actions';

export const error = createAction('error');
export const fireRPC = createAction('fire RPC');
export const unshiftRPCReponse = createAction('unshift RPCResponse');
