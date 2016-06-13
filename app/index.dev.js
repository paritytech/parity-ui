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
  return {
    ws: {
      token: initToken,
      path: '127.0.0.1:8180'
    },
    transactions: {
      finished: [
        {
          id: '0x01',
          from: '0xB4C2328115Fb5A2D7503Cb11969A8f25f3456638',
          value: 87456893245,
          fee: 342532,
          txHash: '0xlKJHf4KLFHdfg',
          data: 'bla bla foo bar!',
          to: '0x575B71fa5dc1d8a23a242F70a70ae88d22B96107'
        },
        {
          id: '0x02',
          from: '0xB4C2328115Fb5A2D7503Cb11969A8f25f3456638',
          value: 87456893245,
          fee: 342532,
          to: '0x575B71fa5dc1d8a23a242F70a70ae88d22B96107'
        }
      ],
      pending: []
    }
  };
}
