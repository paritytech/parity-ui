
import { createAction } from 'redux-actions';

export const confirmTransaction = createAction('confirm transaction');
export const rejectTransaction = createAction('reject transaction');
export const updateTransactions = createAction('update transactions');
