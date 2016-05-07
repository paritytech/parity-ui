
import { isPlainObject } from 'lodash';

export function formatRpcMd (val) {
  if (!isPlainObject(val)) {
    return val;
  }

  return Object.keys(val.details).reduce((acc, key) => {
    acc += `\n- \`${key}\`: ${val.details[key]}`;
    return acc;
  }, val.description);
}
