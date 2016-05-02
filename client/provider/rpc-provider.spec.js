/* global describe, it, xit, beforeEach, expect */

import sinon from 'sinon';
import RpcProvider from './rpc-provider';

describe('PROVIDER - RPC', () => {
  let cut;

  beforeEach('Mock cut', () => {
    const mockedWeb3Utils = { testUtil: sinon.spy() };
    const mockedWeb3Formatters = { testFormatter: sinon.spy() };
    cut = new RpcProvider(mockedWeb3Utils, mockedWeb3Formatters);
    sinon.spy(cut, 'encode');
    sinon.spy(cut, 'decode');
  });

  describe('EXTRA DATA', () => {
    const str = 'parity/1.0.0/1.0.0-beta2';
    const encoded = '0xd783010000867061726974798b312e302e302d6265746132';

    xit('should encode str to encoded', () => {
      expect(cut.encode(str)).to.equal(encoded);
    });

    it('should decode encoded to str', () => {
      expect(cut.decode(encoded)).to.equal(str);
    });
  });

  describe('FORMAT RESULT', () => {
    it('should not format result and coherse to string when no formatter is passed', () => {
      // given
      const result = 5;
      const formatter = null;

      // when
      const returned = cut.formatResult(result, formatter);

      // then
      expect(returned).to.equal('5');
      expect(cut.decode.notCalled).to.be.true;
    });

    it('should call decode and coherse to string when respected formatter is passed', () => {
      // given
      const result = 5;
      const formatter = 'decodeExtraData';

      // when
      const returned = cut.formatResult(result, formatter);

      // then
      expect(cut.decode.calledWith(result)).to.be.true;
      expect(returned).to.not.equal('5');
    });

    it('should format with web3Utils and coherse to string when respected formatter is passed', () => {
      // given
      const result = 5;
      const formatter = 'utils.testUtil';

      // when
      cut.formatResult(result, formatter);

      // then
      expect(cut._web3Utils.testUtil.calledWith(result)).to.be.true;
    });

    it('should format with web3Formatters and coherse to string when respected formatter is passed', () => {
      // given
      const result = 5;
      const formatter = 'testFormatter';

      // when
      cut.formatResult(result, formatter);

      // then
      expect(cut._web3Formatters.testFormatter.calledWith(result)).to.be.true;
    });
  });

  describe('FORMAT PARAMS', () => {
    it('should not format params when no formatters are passed', () => {
      // given
      const params = [5, 20];
      const formatters = null;

      // when
      const returned = cut.formatParams(params, formatters);

      // then
      expect(returned).to.eql(params);
      expect(cut.encode.notCalled).to.be.true;
    });

    xit('should call encode when respected formatters are passed', () => {
      // given
      const params = ['Parity / 2.0'];
      const formatters = ['encodeExtraData'];

      // when
      const returned = cut.formatParams(params, formatters);

      // then
      expect(cut.encode.calledWith(params[0])).to.be.true;
      expect(returned).to.not.eql(params);
    });

    it('should format with web3Utils when respected formatter is passed', () => {
      // given
      const params = [5, 20];
      const formatters = ['utils.testUtil', null];

      // when
      cut.formatParams(params, formatters);

      // then
      expect(cut._web3Utils.testUtil.calledWith(params[0])).to.be.true;
      expect(cut._web3Utils.testUtil.calledOnce).to.be.true;
    });

    it('should format with web3Formatters and coherse to string when respected formatter is passed', () => {
      // given
      const params = [5, 20];
      const formatters = ['testFormatter'];

      // when
      cut.formatParams(params, formatters);

      // then
      expect(cut._web3Formatters.testFormatter.calledWith(params[0])).to.be.true;
      expect(cut._web3Formatters.testFormatter.calledOnce).to.be.true;
    });
  });
});
