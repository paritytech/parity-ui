import { getEstimatedMiningTime, getShortData, getFee, getTotalValue } from './transaction';

describe('util/transaction', () => {
  describe('getEstimatedMiningTime', () => {
    it('should return estimated mining time', () => {
      // given
      const gasPrice = 21000;

      // when
      const res = getEstimatedMiningTime(gasPrice);

      // then
      expect(res).to.equal('20s');
    });
  });

  describe('getShortData', () => {
    it('should return short data', () => {
      // given
      const data = '0xh87dY78';

      // when
      const res = getShortData(data);

      // then
      expect(res).to.equal('0xh...');
    });

    it('should return empty', () => {
      // given
      const data = '';

      // when
      const res = getShortData(data);

      // then
      expect(res).to.equal('empty');
    });

    it('should return empty', () => {
      // given
      const data = null;

      // when
      const res = getShortData(data);

      // then
      expect(res).to.equal('empty');
    });
  });

  describe('getFee', () => {
    it('should return fee', () => {
      // given
      const gas = 2100; // wei
      const gasPrice = 20; // Gwei

      // when
      const res = getFee(gas, gasPrice);

      // then
      expect(res).to.equal(4200000000000000);
    });
  });

  describe('getTotalValue', () => {
    it('should return total value', () => {
      // given
      const fee = 0.000000000254; // eth
      const ethValue = 0.000002; // eth

      // when
      const res = getTotalValue(fee, ethValue);

      // then
      expect(res).to.equal(0.0000000000256);
    });
  });
});
