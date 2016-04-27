'use strict';

module.exports = {
  el: el,
  assertNav: assertNav
};

function el (base, innerSelector) {
  let selector = `[data-test="${base}"]`;
  if (innerSelector) {
    selector += ` ${innerSelector}`;
  }
  return selector;
}

function assertNav (link) {
  const selector = `Header-${link}-link`;
  this.expect.element(el(selector)).to.be.present;
}
