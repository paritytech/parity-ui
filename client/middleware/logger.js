
export default store => next => action => {
  if (store.getState().logger.logging) {
    const msg = [`[${now()}] action: `, action.type, 'payload: ', formatPayload(action.payload)];
    const logMethod = action.type.indexOf('error') > -1 ? 'error' : 'log';
    console[logMethod](...msg);
  }
  return next(action);
};

function now () {
  const date = new Date(Date.now());
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hour = date.getHours();
  return `${hour}::${minutes}::${seconds}`;
}

function formatPayload (payload) {
  if (typeof payload === 'string' || typeof payload === 'number' || typeof payload === 'boolean') {
    return payload;
  }
  return JSON.stringify(payload);
}
