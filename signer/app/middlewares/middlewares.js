// Middleware classes (except logger)
import Transactions from './transactions';
import Ws from './ws';
import App from './app';
import Toastr from './toastr';
import logger from './logger';

export default function middlewares (initToken, tokenSetter, wsPath) {
  // Middleware instances
  const transactions = new Transactions(initToken, wsPath);
  const ws = new Ws(tokenSetter);
  const app = new App();
  const toastr = new Toastr();

  return [
    logger,
    ws.toMiddleware(),
    toastr.toMiddleware(),
    app.toMiddleware(),
    transactions.toMiddleware()
  ];
}
