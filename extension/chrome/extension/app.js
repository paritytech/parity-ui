import './app.html';
import 'reset-css/reset.css';
import './app.css';
import { getToken, setToken, onTokenChange } from '../utils/token';
import app from 'parity-signer';

onTokenChange(initApp);

getToken(initApp);

function initApp (token) {
  app(token, setToken, '127.0.0.1:8180');
}
