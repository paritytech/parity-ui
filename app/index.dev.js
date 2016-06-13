/* global localStorage */
import ee from 'event-emitter';
import app from './';

const emitter = ee({});

tokenGetter(initToken => {
  app(initToken, tokenSetter, addTokenListener, initialState(initToken), '127.0.0.1:8180');
});

function tokenGetter (cb) {
  let token = localStorage.getItem('sysuiToken');
  cb(token);
}

function tokenSetter (token, cb) {
  localStorage.setItem('sysuiToken', token);
  emitter.emit('sysuiToken', token);
  cb && cb();
}

function addTokenListener (cb) {
  emitter.on('sysuiToken', cb);
}

function initialState (initToken) {
  return {};
}
