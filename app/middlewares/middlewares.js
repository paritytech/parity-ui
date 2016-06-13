// Middleware classes (except logger)
import Transactions from './transactions';
import Ws from './ws';
import App from './app';
import logger from './logger';

export default function middlewares (tokenSetter, wsPath) {
  // Middleware instances
  const transactions = new Transactions(wsPath);
  const ws = new Ws(tokenSetter);
  const app = new App();

  return [
    logger,
    ws.toMiddleware(),
    app.toMiddleware(),
    transactions.toMiddleware()
  ];
}
