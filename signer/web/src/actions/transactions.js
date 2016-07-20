import { withToastr } from 'dapps-react-components/src/util/toastr';
import { identity } from 'dapps-react-components/src/util/util';

import { createAction } from 'redux-actions';

export const updatePendingTransactions = createAction('update pendingTransactions');
export const startConfirmTransaction = createAction('start confirmTransaction');
export const successConfirmTransaction = createAction('success confirmTransaction');
export const errorConfirmTransaction = createAction('error confirmTransaction', identity,
  withToastr(args => args.err, 'error')
);
export const startRejectTransaction = createAction('start rejectTransaction');
export const successRejectTransaction = createAction('success rejectTransaction');
export const errorRejectTransaction = createAction('error rejectTransaction', identity,
  withToastr(args => args.err, 'error')
);
