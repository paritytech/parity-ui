
export function hasScrollbar (id) {
  const el = document.getElementById(id);
  return el.clientHeight < el.scrollHeight;
}
