export function openInNewTab (url) {
  const win = window.open(url, '_blank');
  win.focus();
}

export function isHex (str) {
  return !!str.match('[0-9A-F]+');
}

export function isBigNumber (any) {
  return typeof any === 'object' &&
          's' in any && typeof any.s === 'number' &&
          'e' in any && typeof any.e === 'number' &&
          'c' in any;
}
