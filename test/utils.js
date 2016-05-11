'use strict';

module.exports = {
  el: el,
  mckResponses: require('./mocked-responses.json')
};

function el (base, innerSelector) {
  let selector = `[data-test="${base}"]`;
  if (innerSelector) {
    selector += ` ${innerSelector}`;
  }
  return selector;
}
