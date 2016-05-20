import React from 'react';

const isProd = process.env.NODE_ENV === 'production';
const isPerfDebug = process.env.NODE_ENV === 'perf-debug';
const isIntegrationTests = process.env.NODE_ENV === 'tests';

// Component utils for integration tests hooks.
const TEST_HOOK = 'data-test';
React.Component.prototype._test = isProd ? noop : testHook;
React.Component.prototype._testInherit = isProd ? noop : testHookInherit;

function noop (name) {}

function testHookInherit (name) {
  let hook = this.props[TEST_HOOK];
  if (name) {
    hook += `-${name}`;
  }
  return {
    [TEST_HOOK]: hook
  };
}
function testHook (name) {
  let hook = this.constructor.name;
  if (name) {
    hook += `-${name}`;
  }
  return {
    [TEST_HOOK]: hook
  };
}

// Backend mocking framework
if (isIntegrationTests) {
  require('./fake-backend');
}
if (isPerfDebug) {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
