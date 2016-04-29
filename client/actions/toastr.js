
import { createAction } from 'redux-actions';

export const addToast = createAction('add toast');
export const addErrorToast = createAction('add errorToast');
export const addSuccessToast = createAction('add successToast');
export const removeToast = createAction('remove toast');
