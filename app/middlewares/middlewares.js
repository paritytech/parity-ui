// Middleware classes (except logger)
import Transactions from './transactions';
import Ws from './ws';
import App from './app';
import logger from './logger';

export default function middlewares (tokenSetter) {
  // Middleware instances
  const transactions = new Transactions();
  const auth = new Ws(tokenSetter);
  const app = new App();

  return [
    logger,
    auth.toMiddleware(),
    app.toMiddleware(),
    transactions.toMiddleware()
  ];
}
