import chai from 'chai';
import 'mock-local-storage';
// expose expect to global so we won't have to manually import & define it in every test
global.expect = chai.expect;

module.exports = {};
