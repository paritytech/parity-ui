#!/usr/bin/env node
'use strict';

module.exports = {
  params: params,
  returns: returns
};

function params (lines) {
  return lines.reduce((arr, p) => {
    if (isBeginningOfObj(p)) {
      arr.push(toBegginingOfObj(formatParam(p)));
    } else if (isField(p)) {
      let obj = arr[arr.length - 1];
      Object.assign(obj.details, fieldToKeyVal(p));
    } else if (isParam(p)) {
      arr.push(formatParam(p));
    }
    return arr;
  }, []);
}

function returns (lines) {
  if (isBeginningOfObj(lines[0])) {
    return lines.reduce((obj, p) => {
      if (isField(p)) {
        Object.assign(obj.details, fieldToKeyVal(p));
      }
      return obj;
    }, toBegginingOfObj(lines[0]));
  }
  return lines[0];
}

function isBeginningOfObj (line) {
  return line.indexOf(`Object`) > -1;
}

function isField (line) {
  return line.indexOf('  - `') === 0;
}

function fieldToKeyVal (line) {
  const key = line.slice(5, line.indexOf('`:'));
  const value = line.slice(line.indexOf(': `') + 2);
  return {
    [key]: value
  };
}

function toBegginingOfObj (param) {
  return {
    description: param,
    details: {}
  };
}

function formatParam (p) {
  return p.slice(3);
}

function isParam (line) {
  return !!line[0].match(/[0-9]/);
}
