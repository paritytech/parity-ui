
// Middleware classes (except logger)
import Transactions from './transactions';
import Ws from './ws';
import logger from './logger';

export default function middlewares (tokenSetter) {
  // Middleware instances
  const transactions = new Transactions();
  const auth = new Ws(tokenSetter);

  return [
    logger,
    auth.toMiddleware(),
    transactions.toMiddleware()
  ];
}
