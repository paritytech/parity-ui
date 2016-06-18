import { createAction } from 'redux-actions';
import { identity } from '../utils/utils';
import { withToastr } from '../utils/toastr';

export const errorTransaction = createAction('error transaction', identity, withToastr(identity, 'error'));
export const confirmTransaction = createAction('confirm transaction');
export const rejectTransaction = createAction('reject transaction');
export const updatePendingTransactions = createAction('update pendingTransactions');
export const addRejectedTransaction = createAction('add rejectedTransaction');
export const addConfirmedTransaction = createAction('add confirmedTransaction');
export const addErrorTransaction = createAction('add errorTransaction');
