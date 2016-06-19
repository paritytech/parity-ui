# Parity System UI Chrome Extension

[![Join the chat at}[gitter-url]][gitter-image]][gitter-url]
[![GPLv3][license-image]][license-url]

## Features
 - Sign / reject transactions

 ## Install
* [Get latest production version from webstore][webstore-ext-url]

## Development
```bash
$ git clone git@github.com:ethcore/parity-sysui-chrome-extension.git
$ npm i
$ npm run dev # build files to './dev', start webpack dev server
```
* [Load unpacked extensions][dev-ext-help-url] with `./dev` folder.

## Build
```bash
$ npm run genZip # build files to './build', pack to zip file
```


[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge "https://gitter.im/ethcore/parity"
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html
[dev-ext-help-url]: https://developer.chrome.com/extensions/getstarted#unpacked
[webstore-ext-url]: https://chrome.google.com/webstore/detail/parity-signer-ui/fgodinogimdopkigkcoelpfkbnpngalc?authuser=1