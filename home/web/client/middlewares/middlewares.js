import Logger from 'dapps-react-components/src/middlewares/Logger';
import Toastr from 'dapps-react-components/src/middlewares/Toastr';
import Dapps from './dapps';
import Storage from './storage';
import Rpc from './rpc';

export default function middlewares (internalWeb3) {
  const logger = new Logger();
  const toastr = new Toastr();
  const dapps = new Dapps();
  const storage = new Storage();
  const rpc = new Rpc(internalWeb3);

  return [
    logger.toMiddleware(),
    toastr.toMiddleware(),
    dapps.toMiddleware(),
    storage.toMiddleware(),
    rpc.toMiddleware()
  ];
}
