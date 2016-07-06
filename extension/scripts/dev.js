const tasks = require('./tasks');
const createWebpackServer = require('webpack-httpolyglot-server');
const devConfig = require('../webpack/dev.config');

tasks.replaceWebpack();
console.log('[Copy assets]');
console.log('-'.repeat(80));
tasks.copyAssets('dev');

console.log('[Webpack Dev]');
console.log('-'.repeat(80));
console.log('load unpacked extensions with `./dev` folder. (see https://developer.chrome.com/extensions/getstarted#unpacked)\n');
createWebpackServer(devConfig, {
  host: 'localhost',
  port: 3030
});
