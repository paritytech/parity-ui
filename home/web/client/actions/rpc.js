import { createAction } from 'redux-actions';

export const error = createAction('error rpc');
export const updateActiveAccount = createAction('update activeAccount');
export const updateAccountsNames = createAction('update accountsNames');
export const createAccount = createAction('create account');
export const resetCreateAccount = createAction('reset createAccount');

export const updatePendingTransaction = createAction('update pendingTransaction');
export const rejectTransaction = createAction('reject transaction');
export const startSignTransaction = createAction('start signTransaction');
export const successSignTransaction = createAction('success signTransaction');
export const errorSignTransaction = createAction('error signTransaction');

export const errorCreatedAccount = createAction('error transaction');
export const updateCreatedAccount = createAction('update createdAccount');

// used by rpc provider
export const updateNetwork = createAction('update network');
export const updateSignerPort = createAction('update signerPort');
export const updateAccounts = createAction('update accounts');
export const updateSyncing = createAction('update syncing');
export const updateLatestBlock = createAction('update latestBlock');
export const updatePeers = createAction('update peers');
export const updateUnsignedTransactionsCount = createAction('update unsignedTransactionsCount');
