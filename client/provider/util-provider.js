
export function isBigNumber (any) {
  return any && any.constructor && any.constructor.name === 'BigNumber';
}
