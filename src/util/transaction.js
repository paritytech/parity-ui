
export const getEstimatedMiningTime = _getEstimatedMiningTime;
export const getShortData = _getShortData;
export const getFee = _getFee;
export const getTotalValue = _getTotalValue;

function _getEstimatedMiningTime (gasPrice) {
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
