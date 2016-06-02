global.log = (...args) => {
  console.log(...args);
  chrome.extension.getBackgroundPage().console.log(...args);
}
