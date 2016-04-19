import {Component} from 'react';

Component.prototype._test = (process.env.NODE_ENV === 'production') ? noop : testHook;

function noop(name) {}

function testHook(name) {
  return {
    'data-test': `${this.constructor.name}-${name}`
  }
}
