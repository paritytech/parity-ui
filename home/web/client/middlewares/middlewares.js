import Logger from 'dapps-react-components/src/middlewares/Logger';
import Toastr from 'dapps-react-components/src/middlewares/Toastr';

export default function middlewares () {
  // Middleware instances
  const toastr = new Toastr();
  const logger = new Logger();

  return [
    logger.toMiddleware(),
    toastr.toMiddleware()
  ];
}
