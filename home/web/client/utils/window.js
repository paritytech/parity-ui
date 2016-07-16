export function openTab (url) {
  const win = window.open(url, '_blank');
  win.focus();
}
