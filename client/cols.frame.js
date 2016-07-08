import '!file?name=home/[name].html!./cols.frame.html';
import { NAMESPACE, PREFIX } from './components/Storage/cols.data';
import localStorage from './components/Storage/safeLocalStorage';

window.addEventListener('message', function (ev) {
  const { source, origin, data } = ev;
  if (!data || data.namespace !== NAMESPACE || data.type !== 'request' || !data.id) {
    // Ignore messages with no data or with wrong namespace or type
    return;
  }

  processMessage(data.data, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    source.postMessage({
      namespace: NAMESPACE,
      type: 'response',
      id: data.id,
      data: response
    }, origin);
  });
});

function processMessage (data, cb) {
  const { action, key, value } = data;
  if (!action || !key) {
    return cb('Missing fields. Action:', action, 'Key: ', key);
  }

  if (action === 'ping') {
    return cb(null, true);
  }

  if (action === 'set') {
    localStorage.setItem(`${PREFIX}-${key}`, value);
    return cb(null, true);
  }

  if (action === 'get') {
    return cb(null, localStorage.getItem(`${PREFIX}-${key}`));
  }
}
