
import React from 'react';
import { isArray, isPlainObject } from 'lodash';

export function hasScrollbar (el) {
  return el.clientHeight < el.scrollHeight;
}

export function formatRenderedResponse (res) {
  if (isArray(res)) {
    return res.map((r, idx) => (
      <span>
        {idx === 0 ? '[' : ','}
        {idx === 0 ? '' : <br />}
        {r}
        {idx === res.length - 1 ? ']' : ''}
      </span>
    ));
  }
  if (isPlainObject(res)) {
    const arr = JSON.stringify(res, null, 1);
    return arr.split('\n').map((any, idx) => (
      <span>
        {any}
        {idx !== 0 && idx !== arr.length - 1 ? <br /> : ''}
      </span>
    ));
  }
  return res;
}
