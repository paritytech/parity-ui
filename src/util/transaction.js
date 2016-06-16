import BigNumber from 'bignumber.js';

const WEI_TO_ETH_MULTIPLIER = 0.000000000000000001;
const WEI_TO_SZABU_MULTIPLIER = 0.000000000001;
import { BASE_LINK_TX_MORDEN, BASE_LINK_TX_HOMESTEAD } from '../constants/constants';

export const getEstimatedMiningTime = _getEstimatedMiningTime;
export const getShortData = _getShortData;
// calculations
export const getFee = _getFee;
export const getTotalValue = _getTotalValue;
// displays
export const getSzaboFromWeiDisplay = _getSzaboFromWeiDisplay;
export const getValueDisplay = _getValueDisplay;
export const getValueDisplayWei = _getValueDisplayWei;
export const getTotalValueDisplay = _getTotalValueDisplay;
export const getTotalValueDisplayWei = _getTotalValueDisplayWei;
export const getEthFromWeiDisplay = _getEthFromWeiDisplay;
// links
export const getTxLink = _getTxLink;

function _getEstimatedMiningTime (gasPrice, miningStatistics) {
  return '20s';
}

function _getShortData (data) {
  if (data === '0x') {
    return data;
  }
  return data.substr(0, 3) + '...';
}

/*
 * @param {hex string} gas
 * @param {wei hex string} gasPrice
 * @return {BigNumber} fee in wei
 */
function _getFee (gas, gasPrice) {
  gas = new BigNumber(gas);
  gasPrice = new BigNumber(gasPrice);
  return gasPrice.times(gas);
}

/*
 * @param {wei BigNumber} fee
 * @param {wei hex string} value
 * @return {BigNumber} total value in wei
 */
function _getTotalValue (fee, value) {
  value = new BigNumber(value);
  return fee.plus(value);
}

/*
 * @param {wei hex string} gasPrice
 * @return {string} szabo gas price with unit [szabo] i.e. 21,423 [szabo]
 */
function _getSzaboFromWeiDisplay (gasPrice) {
  gasPrice = new BigNumber(gasPrice);
  return gasPrice.times(WEI_TO_SZABU_MULTIPLIER).toPrecision(5);
}

/*
 * @param {wei hex string} value
 * @return {string} value in WEI nicely formatted
 */
function _getValueDisplay (value) {
  value = new BigNumber(value);
  return value.times(WEI_TO_ETH_MULTIPLIER).toPrecision(5);
}

function _getValueDisplayWei (value) {
  value = new BigNumber(value);
  return value.toFormat(0);
}

/*
 * @param {wei hex string} totalValue
 * @return {string} total value (including fee) with units i.e. 1.32 [eth]
 */
function _getTotalValueDisplay (totalValue) {
  totalValue = new BigNumber(totalValue);
  return totalValue.times(WEI_TO_ETH_MULTIPLIER).toPrecision(5);
}

function _getTotalValueDisplayWei (totalValue) {
  totalValue = new BigNumber(totalValue);
  return totalValue.toFormat(0);
}


function _getEthFromWeiDisplay (weiHexString) {
  const value = new BigNumber(weiHexString);
  return value.times(WEI_TO_ETH_MULTIPLIER).toPrecision(5);
}

function _getTxLink (txHash, chain) {
  const base = chain === 'morden' || chain === 'testnet' ? BASE_LINK_TX_MORDEN : BASE_LINK_TX_HOMESTEAD;
  return base + txHash;
}
