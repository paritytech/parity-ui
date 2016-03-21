#!/usr/bin/env node

"use strict";

const fs = require('fs');
const glob = require('glob');
const mime = require('mime');

const name = 'Wallet';

const files = glob.sync('**/*', {
  cwd: process.cwd(),
  nodir: true
});

write(`/// This file is generated. Do not edit it by hand.`);
write(`extern crate parity_webapp;`);
write('');
write('use std::default::Default;');
write('use parity_webapp::WebApp;');
write('use parity_webapp::File;');

write('');
// generate structure
write(`pub struct ${name} {`);
write(files.map(safeName).map((f) => `  ${f}: File,`).join('\n'))
write(`}`);
write('');
// generate implementation
write(`impl WebApp for ${name} {`);
write(`  fn files(&self) -> Vec<&File> {`);
write(`    vec![`);
write(`    ` + files.map(safeName).map((f) => `&self.${f}`).join(',\n'));
write(`    ]`);
write(`  }`);
write(`}`);
write('');
// generate default
write(`impl Default for ${name} {`);
write(`  fn default() -> Self {`);
write(`  ${name} {`);
write(files.map((f) => {
  const safe = safeName(f);
  const type = contentType(f);
  return ` ${safe}: File { path: "${f}", content_type: "${type}", content: include_str!("./web/${f}") },`;
}).join('\n'));
write(`  }`);
write(`  }`);
write(`}`);
write('');

function write(a) {
  console.log(a);
}
function safeName(f) {
  return 'f_' + f.replace(/[\/\.\-]/g, '_').toLowerCase();
}
function contentType(f) {
  return mime.lookup(f);
}
