/* global localStorage */
import ee from 'event-emitter';
import app from './';

const emitter = ee({});

tokenGetter(initToken => {
  app(initToken, tokenSetter, addTokenListener);
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
