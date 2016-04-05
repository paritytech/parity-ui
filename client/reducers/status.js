
import { handleActions } from 'redux-actions';

const initialState = {
  name: 'My node',
  bestBlock: '1280633',
  hashrate: '10000000',
  version: 'Parity//v1.1.0-unstable-393099e-20160322/x86_64-linux-gnu/rustc1.8.0-beta.1'
};

export default handleActions({
}, initialState);
