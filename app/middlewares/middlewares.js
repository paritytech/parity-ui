
// Middleware classes (except logger)
import Transactions from './transactions';
import Auth from './auth';
import logger from './logger';

export default function middlewares (tokenSetter) {
  // Middleware instances
  const transactions = new Transactions();
  const auth = new Auth(tokenSetter);

  return [
    logger,
    auth.toMiddleware(),
    transactions.toMiddleware()
  ];
}
