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
  return gasPrice * gas / 1E9; // convert GWei to ETH
}

function _getTotalValue (fee, ethValue) {
  // TODO [ToDr] 0.0001 + 100000..00.00 (double might not be enough)
  return fee + ethValue;
}

function _getTxLink (txHash, chain) {
  const base = chain === 'morden' ? BASE_LINK_TX_MORDEN : BASE_LINK_TX_HOMESTEAD;
  return base + txHash;
}
