import BigNumber from 'bignumber.js';
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

    it('should return 0x', () => {
      // given
      const data = '0x';

      // when
      const res = getShortData(data);

      // then
      expect(res).to.equal('0x');
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
      expect(res).to.equal(0.000042);
    });
  });

  describe('getTotalValue', () => {
    it('should return total value', () => {
      // given
      const fee = new BigNumber(0.000000000254); // wei
      const value = 0.000002; // wei hex

      // when
      const res = getTotalValue(fee, value);

      // then
      expect(res).to.equal(0.0000000000256);
    });
  });
});
