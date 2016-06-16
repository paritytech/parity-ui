import BigNumber from 'bignumber.js';

import { BASE_LINK_TX_MORDEN, BASE_LINK_TX_HOMESTEAD } from '../constants/constants';

export const getEstimatedMiningTime = _getEstimatedMiningTime;
export const getShortData = _getShortData;
// calculations
export const getFee = _getFee;
export const getTotalValue = _getTotalValue;
// displays
export const getGasPriceDisplay = _getGasPriceDisplay;
export const getValueDisplay = _getValueDisplay
export const getTotalValueDisplay = _getTotalValueDisplay
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
 * @return {string} gas price with units i.e. 21,423 [wei]
 */
function _getGasPriceDisplay (gasPrice) {
  gasPrice = new BigNumber(gasPrice);
  return gasPrice.toFixed(0);
}

/*
 * @param {wei hex string} value
 * @return {string} value with units i.e. 1.3 [eth]
 */
function _getValueDisplay (value) {
  value = new BigNumber(value);
  return value.toFixed(2);
}

/*
 * @param {wei hex string} totalValue
 * @return {string} total value (including fee) with units i.e. 1.32 [eth]
 */
function _getTotalValueDisplay (totalValue) {
  totalValue = new BigNumber(totalValue);
  return totalValue.toFixed(2);
}

function _getTxLink (txHash, chain) {
  const base = chain === 'morden' ? BASE_LINK_TX_MORDEN : BASE_LINK_TX_HOMESTEAD;
  return base + txHash;
}

// internal functions
function _display (BigNumber) {
  
}
