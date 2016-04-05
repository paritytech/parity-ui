
import { handleActions } from 'redux-actions';

const initialState = {
  chain: 'homestead',
  networkPort: 30303,
  maxPeers: 25,
  rpcEnabled: true,
  rpcInterface: 'all',
  rpcPort: 8545
};

export default handleActions({
}, initialState);
