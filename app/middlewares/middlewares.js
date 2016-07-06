// Middleware classes (except logger)
import Ws from './ws';
import App from './app';
import Toastr from './toastr';
import logger from './logger';

export default function middlewares (ws, tokenSetter) {
  // Middleware instances
  const wsMiddleware = new Ws(ws, tokenSetter);
  const app = new App();
  const toastr = new Toastr();

  return [
    logger,
    wsMiddleware.toMiddleware(),
    toastr.toMiddleware(),
    app.toMiddleware()
  ];
}
