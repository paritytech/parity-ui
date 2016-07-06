import 'reset-css/reset.css';
import './App.css';
import { getToken, setToken, onTokenChange } from '../utils/token';
import app from 'parity-sysui-app';

onTokenChange(initApp);

getToken(initApp);

function initApp (token) {
  app(token, setToken, '127.0.0.1:8180');
}
