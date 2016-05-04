# Parity status page

[![Build Status][travis-image]][travis-url]
[![js-semistandard-style][semistandard-image]][semistandard-url]
[![Join the chat at}[gitter-url]][gitter-image]][gitter-url]
[![GPLv3][license-image]][license-url]
[![Build Size][build-size-image]]


[travis-image]: https://travis-ci.org/ethcore/eth-node-status-page.svg?branch=master "Build Status"
[travis-url]: https://travis-ci.org/ethcore/eth-node-status-page
[semistandard-url]: (https://github.com/Flet/semistandard)
[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[coveralls-image]: https://coveralls.io/repos/github/ethcore/eth-node-status-page/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ethcore/eth-node-status-page?branch=master "Coverage Status"
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge "https://gitter.im/ethcore/parity"
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html
[build-size-image]: http://ethcore.github.io/eth-node-status-page/build-size.svg "Build Size"
<!-- todo [adgo] - add build analysis page and link badge to it -->
<!-- [build-size-url]: https://travis-ci.org/ethcore/eth-node-status-page -->



### develop
```bash
git clone git@github.com:ethcore/eth-node-status-page.git
cd eth-node-status-page
npm i
npm start
```

### test
#### Unit Tests
```bash
npm start
npm t # run unit tests in watchmode
```

#### Integration Tests
```bash
npm startTest # run with mocked backend
npm run nightwatch
```

### Parity
follow the intructions to run parity [here](https://github.com/ethcore/parity)