#!/usr/bin/env node

"use strict";

const fs = require('fs');
const glob = require('glob');
const mime = require('mime');
const toml = require('toml');

const name = 'App';

const files = glob.sync('**/*', {
  cwd: process.cwd(),
  nodir: true
});

const meta = readMeta(files);

write(`/// This file is generated. Do not edit it by hand.`);
write(`/// This file is generated. Do not edit it by hand.`);

write(`extern crate parity_webapp;`);
write('');
write('use std::default::Default;');
write('use std::collections::HashMap;');
write('use parity_webapp::{WebApp, File, Info};');

write('');
// generate structure
write(`pub struct ${name} {`);
write(`  files: HashMap<&'static str, File>,`);
write(`}`);
write('');
// generate implementation
write(`impl WebApp for ${name} {`);
write(`  fn file(&self, path: &str) -> Option<&File> {`);
write(`    self.files.get(path)`);
write(`  }`);
write(`  fn info(&self) -> Info {`);
write(`    Info {`);
write(`      name: "${meta.fullName}".to_owned(),`);
write(`      version: "${meta.version}".to_owned(),`);
write(`      author: "${meta.author}".to_owned(),`);
write(`      description: "${meta.description}".to_owned(),`);
write(`      icon_url: "${meta.iconUrl}".to_owned(),`);
write(`    }`);
write(`  }`);
write(`}`);
write('');

// generate default
write(`impl Default for ${name} {`);
write(`  fn default() -> Self {`);
write(`    let files = {`);
write(`      let mut files = HashMap::new();`);
write(fillFiles(files).map((f) => `      ${f}`).join('\n'));
write(`      files`);
write(`    };`);
write(`    ${name} {`);
write(`      files: files,`);
write(`    }`);
write(`  }`);
write(`}`);

function readMeta() {
  const meta = toml.parse(fs.readFileSync('../../Cargo.toml', 'utf8'));
  
  return {
    fullName: process.env.FULL_NAME || meta.package.name,
    version: meta.package.version,
    author: meta.package.authors.join(', '),
    description: meta.package.description || '',
    iconUrl: process.env.IMAGE_URL || 'icon.png',
  };
}

function fillFiles(files) {
  return files.map((f) => {
    const safe = safeName(f);
    const type = contentType(f);
    const content = `include_bytes!("./web/${f}")`;

    return `files.insert("${f}", File { path: "${f}", content_type: "${type}", content: ${content} });`;
  });
}

function readBinary(f) {
  return Array.from(fs.readFileSync(f).values());
}
function isBinaryType(t) {
  return t.indexOf('font') > -1 || t.indexOf('png') > -1 || t.indexOf('image') > -1;
}
function write(a) {
  console.log(a);
}
function safeName(f) {
  return 'f_' + f.replace(/[\/\.\-@]/g, '_').toLowerCase();
}
function contentType(f) {
  return mime.lookup(f);
}
