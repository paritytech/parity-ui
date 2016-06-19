import BigNumber from 'bignumber.js';
import { WEI_TO_ETH_MULTIPLIER } from '../constants/constants';


export const weiHexToEthString = weiHex => {
  weiHex = new BigNumber(weiHex);
  return weiHex.times(WEI_TO_ETH_MULTIPLIER).toFormat(5);
}
