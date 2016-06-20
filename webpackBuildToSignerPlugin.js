// http://nodejs.org/api.html#_child_processes
var exec = require('child_process').exec;

var cpSrc = 'build/index.js';
var cpTarget = '../parity-dapps-minimal-sysui-rs/src/web/app.js';

function puts(error, stdout, stderr) { 
  console.log(`copied ${cpSrc} to ${cpTarget}`);
  console.log(stdout);
}

var buildToSignerPlugin = function(/*options*/) {
};

buildToSignerPlugin.prototype.apply = function(compiler) {
  compiler.plugin("done", onDone);
};

module.exports = buildToSignerPlugin;

function onDone(/*params*/) {
  console.log("\n****************************");
  console.log("[SIGNER PLUGIN] WEBPACK DONE");
  console.log("****************************\n");
  // copy build index.js to destination
  var cpJs = `cp ${cpSrc} ${cpTarget}`;
  exec(cpJs, puts);
}
