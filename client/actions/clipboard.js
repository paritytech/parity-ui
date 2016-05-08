
import { createAction } from 'redux-actions';
import { identity } from '../util';
import { metaToastr } from '../util/toastr';

export const copyToClipboard = createAction('copy toClipboard', identity, metaToastr);
