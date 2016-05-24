
export function addCssToDocument (css) {
  const head = document.head;
  const sheet = document.createElement('style');
  sheet.innerHTML = css;
  head.appendChild(sheet);
}
