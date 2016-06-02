
// Middleware classes (except logger)
import Transactions from './transactions';
import Localstorage from './localstorage';
import logger from './logger';

export default function middlewares () {
  // Middleware instances
  const transactions = new Transactions();
  const localstorage = new Localstorage();

  return [
    logger,
    localstorage.toMiddleware(),
    transactions.toMiddleware()
  ];
}
