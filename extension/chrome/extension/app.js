import './app.html';
import 'reset-css/reset.css';
import './app.css';
import { getToken, setToken, onTokenChange } from '../utils/token';
import app from 'parity-signer';

onTokenChange(initApp);

getToken(initApp);

function initApp (token) {
  app(token, onSetToken, '127.0.0.1:8180');
}

function onSetToken (token) {
  setToken(token);
  window.location.href = 'app.html';
}
