
export function scrollTo (element, to, duration) {
  let start = element.scrollTop;
  let change = to - start;
  let increment = 20;

  let animateScroll = elapsedTime => {
    elapsedTime += increment;
    let position = easeInOut(elapsedTime, start, change, duration);
    element.scrollTop = position;
    if (elapsedTime < duration) {
      setTimeout(() => {
        animateScroll(elapsedTime);
      }, increment);
    }
  };

  animateScroll(0);
}

export function easeInOut (currentTime, start, change, duration) {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return change / 2 * currentTime * currentTime + start;
  }
  currentTime -= 1;
  return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
}
