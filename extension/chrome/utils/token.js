export function setToken (token) {
  chrome.storage.local.set({ sysuiToken: token });
}

export function getToken (cb) {
  chrome.storage.local.get('sysuiToken', obj => {
    let { sysuiToken } = obj;
    if (!sysuiToken) {
      return;
    }
    sysuiToken = sysuiToken.replace(/"/g, '');
    cb(sysuiToken);
  });
}

export function onTokenChange (cb) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (!(namespace === 'local' && 'sysuiToken' in changes)) {
      return cb(false);
    }
    const token = changes.sysuiToken.newValue.replace(/"/g, '');
    cb(token);
  });
}
