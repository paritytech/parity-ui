
import { createAction } from 'redux-actions';
import { identity } from '../util';
import { metaToastr } from '../util/toastr';

export const updateLogging = createAction('update logging', identity,
  flag => metaToastr(`logging updated to ${flag}`)
);
