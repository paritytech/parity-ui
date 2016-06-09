
import { createAction } from 'redux-actions';

export const confirmTransaction = createAction('confirm transaction');
export const rejectTransaction = createAction('reject transaction');
export const updatePendingTransactions = createAction('update pendingTransactions');
export const addFinishedTransaction = createAction('add finishedTransactions');
