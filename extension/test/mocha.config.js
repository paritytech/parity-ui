import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(sinonChai);

// expose expect to global so we won't have to manually import & define it in every test
global.expect = chai.expect;
global.sinon = sinon;
module.exports = {};
