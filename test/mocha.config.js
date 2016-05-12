import chai from 'chai';
import jsdom from 'jsdom';

// expose expect to global so we won't have to manually import & define it in every test
global.expect = chai.expect;

// setup jsdom
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

// only imported after jsdom setup
import 'mock-local-storage';

module.exports = {};
