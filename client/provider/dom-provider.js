
export function hasScrollbar (rel) {
  const elem = el(rel);
  return elem.clientHeight < elem.scrollHeight;
}

export function el (rel) {
  return document.querySelector(`[rel=${rel}]`);
}
