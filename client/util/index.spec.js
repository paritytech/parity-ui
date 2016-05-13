import { toPromise, stringifyIfObject, identity } from './index';

describe('util/index', () => {
  describe('toPromise', () => {
    it('rejects on error result', () => {
      const ERROR = new Error();
      const FN = function (callback) {
        callback(ERROR);
      };

      return toPromise(FN).catch((err) => {
        expect(err).to.equal(ERROR);
      });
    });

    it('resolves on success result', () => {
      const SUCCESS = 'ok, we are good';
      const FN = function (callback) {
        callback(null, SUCCESS);
      };

      return toPromise(FN).then((success) => {
        expect(success).to.equal(SUCCESS);
      });
    });
  });

  describe('stringifyIfObject', () => {
    describe('when non-objects are passed', () => {
      it('returns string as-is', () => {
        const TEST = 'test string';

        expect(stringifyIfObject(TEST)).to.equal(TEST);
      });

      it('returns bool as-is', () => {
        const TEST = true;

        expect(stringifyIfObject(TEST)).to.equal(TEST);
      });

      it('returns number as-is', () => {
        const TEST = 123.456;

        expect(stringifyIfObject(TEST)).to.equal(TEST);
      });
    });

    describe('when objects are passed', () => {
      it('returns stringified object', () => {
        const TEST = { abc: 'def' };

        expect(stringifyIfObject(TEST)).to.equal(JSON.stringify(TEST));
      });

      it('returns stringified array', () => {
        const TEST = ['abc', 'def'];

        expect(stringifyIfObject(TEST)).to.equal(JSON.stringify(TEST));
      });
    });
  });

  describe('identity', () => {
    it('returns the value passed in', () => {
      const TEST = { abc: 'def' };

      expect(identity(TEST)).to.deep.equal(TEST);
    });
  });
});
