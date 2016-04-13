/* global describe, it, expect */

import {isBigNumber} from './util-provider';
import BigNumber from 'bignumber.js';

describe('UTIL PROVIDER', () => {
  it('should return true if is big number', () => {
    const big = new BigNumber(123.4567);
    expect(isBigNumber(big)).to.be.true;
  });

  it('should return false if is NOT big number', () => {
    expect(isBigNumber(123.4567)).to.be.false;
  });
});
