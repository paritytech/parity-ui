export function openInNewTab (url) {
  const win = window.open(url, '_blank');
  win.focus();
}

export function isHex (str) {
  return !!str.match('[0-9A-F]+');
}
