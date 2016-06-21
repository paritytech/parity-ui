// http://nodejs.org/api.html#_child_processes
const exec = require('child_process').exec;

const cpSrc = 'build/index.js';
const cpTarget = '../parity-dapps-minimal-sysui-rs/src/web/app.js';

function puts (err, stdout, stderr) {
  console.log('\n\n****************************');
  if (err) {
    console.log('[SIGNER PLUGIN] error, err');
    return;
  }
  console.log(`[SIGNER PLUGIN] copied ${cpSrc} to ${cpTarget}`);
  if (stdout) {
    console.log('[SIGNER PLUGIN] ', stdout);
  }
  console.log('****************************\n');
}

const buildToSignerPlugin = function (/* options */) {
};

buildToSignerPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', onDone);
};

module.exports = buildToSignerPlugin;

function onDone (/* params */) {
  console.log('\n\n****************************');
  console.log('[SIGNER PLUGIN] WEBPACK DONE');
  console.log('****************************\n');
  // copy build index.js to destination
  const cpJs = `cp ${cpSrc} ${cpTarget}`;
  exec(cpJs, puts);
}
