import {Component} from 'react';
import mockedResponses from '../test/mocked-responses.json';

const isProd = process.env.NODE_ENV === 'production';
const isIntegrationTests = process.env.NODE_ENV === 'tests';

// Component utils for integration tests hooks.
const TEST_HOOK = 'data-test';
Component.prototype._test = isProd ? noop : testHook;
Component.prototype._testInherit = isProd ? noop : testHookInherit;

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
  const sinon = require('sinon/pkg/sinon');

  class FakeRpcServer {
    constructor () {
      this.xhr = null;
      this.middlewares = [];
    }

    start () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      this.xhr.onCreate = ::this.handleRequest;
      return () => this.xhr.restore();
    }

    simpleRpc (rpcMethod, result) {
      this.rpc(rpcMethod, (req) => result);
    }

    rpc (rpcMethod, middleware) {
      this.middlewares.unshift({
        rpcMethod, middleware
      });
    }

    handleRequest (req) {
      setTimeout(() => {
        req.body = JSON.parse(req.requestBody);
        const middlewaresForMethod = this.middlewares
          .filter((m) => m.rpcMethod === req.body.method);

        const response = middlewaresForMethod
          .map((m) => m.middleware)
          .reduce((replied, middleware) => {
            if (replied) {
              return replied;
            }

            return middleware(req);
          }, false);

        if (!response) {
          return req.respond(405, {
            'Content-Type': 'application/json'
          }, JSON.stringify({
            jsonrpc: '2.0',
            id: req.body.id,
            result: null
          }));
        }

        return req.respond(200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({
          jsonrpc: '2.0',
          id: req.body.id,
          result: response
        }));
      });
    }
  }

  const fakeRpc = new FakeRpcServer();
  fakeRpc.start();
  mockedResponses.rpc.forEach(method => fakeRpc.simpleRpc(method.name, method.response));

  // export fakeRpc to mock stuff in tests
  window.fakeRpc = fakeRpc;
}
