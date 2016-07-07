#!/usr/bin/env node
'use strict';

const customFunctions = require('./custom-functions');
const addFormatters = require('./add-formatters');
const format = require('./format');

const fs = require('fs');
const nl = /\n+/;
const OUTPUT_PATH = `${__dirname}/../client/data/rpc.json`;

const val = fs.readFileSync(`${__dirname}/docs.md`, 'utf8');
const funcs = val.split(/\s#### /)
  // Skip first element (intro docs)
  .slice(1)
  // Extract data
  .map(parseSingleMethod)
  // Add our custom functions
  .concat(customFunctions)
  // Add formatters
  .map(addFormatters);

// console.log(funcs);
fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
  methods: funcs
}, null, 2), 'utf8');

console.log(`success generated json at ${OUTPUT_PATH.split('../')[1]}`);

function parseSingleMethod (data) {
  const parts = data.split('##### ');
  let name = parts[0].split(nl)[0];
  let desc = nonEmpty(parts[0].split(nl).slice(1)).join('\n');
  let params = format.params(nonEmpty(parts[1].split(nl).slice(1)));
  let returns = format.returns(nonEmpty(parts[2].split(nl).slice(1)));

  return {
    name, desc, params, returns
  };
}

function nonEmpty (a) {
  return a.filter(x => x);
}
