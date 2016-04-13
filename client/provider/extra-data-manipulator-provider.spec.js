/* global describe, it, expect */

import Manipultor from './extra-data-manipulator-provider';

const manipulator = new Manipultor();

describe('EXTRA DATA MANIPULATOR', () => {
  const str = 'parity/1.0.0-beta2';
  const encoded = '0xd783010000867061726974798b312e302e302d6265746132';

  it('should encode str to encoded', () => {
    expect(manipulator.encode(str)).to.equal(encoded);
  });

  it('should decode encoded to str', () => {
    expect(manipulator.decode(encoded)).to.equal(str);
  });
});
