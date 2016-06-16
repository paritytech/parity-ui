import { BASE_LINK_TX_MORDEN, BASE_LINK_TX_HOMESTEAD } from '../constants/constants';

export const getEstimatedMiningTime = _getEstimatedMiningTime;
export const getShortData = _getShortData;
export const getFee = _getFee;
export const getTotalValue = _getTotalValue;
export const getTxLink = _getTxLink;

function _getEstimatedMiningTime (gasPrice, miningStatistics) {
  return '20s';
}

function _getShortData (data) {
  if (!data || data.length === 0) {
    return 'empty';
  }

  return data.substr(0, 3) + '...';
}

function _getFee (gas, gasPrice) {
  return gasPrice * gas * 1000000000000000000 * 1000000000; // convert wei * Gewi to ETH
}

function _getTotalValue (fee, ethValue) {
  return fee + ethValue;
}

function _getTxLink (txHash, chain) {
  const base = chain === 'morden' ? BASE_LINK_TX_MORDEN : BASE_LINK_TX_HOMESTEAD;
  return base + txHash;
}
