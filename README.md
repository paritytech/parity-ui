# Parity Status Page

[![Build Status][travis-image]][travis-url]
[![js-semistandard-style][semistandard-image]][semistandard-url]
[![Join the chat at}[gitter-url]][gitter-image]][gitter-url]
[![GPLv3][license-image]][license-url]
![Build Size][build-size-image]
[![Coverage Status][coveralls-image]][coveralls-url]

[travis-image]: https://travis-ci.org/ethcore/parity-dapps-status.svg?branch=master "Build Status"
[travis-url]: https://travis-ci.org/ethcore/parity-dapps-status
[semistandard-url]: (https://github.com/Flet/semistandard)
[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[coveralls-image]: https://coveralls.io/repos/github/ethcore/parity-dapps-status/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/ethcore/parity-dapps-status?branch=master "Coverage Status"
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge "https://gitter.im/ethcore/parity"
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html
[build-size-image]: http://ethcore.github.io/parity-dapps-status/build-size.svg "Build Size"
<!-- todo [adgo] - add build analysis page and link badge to it -->
<!-- [build-size-url]: https://travis-ci.org/ethcore/parity-dapps-status -->

### [Demo](http://ethcore.github.io/parity-dapps-status)

### How to start?
```bash
$ git clone git@github.com:ethcore/parity-dapps-status.git
$ cd parity-dapps-status
$ npm i                      # install dependencies
$ npm start                  # run webpack-dev-server and proxy RPC calls to http://localhost:8080
                             # open http://localhost:3000 in your browser
```

### Development workflow

#### Status Page
To run development version of `Status Page` just run:

```bash
$ cd parity-dapps-status
$ npm start                  # and open browser at http://localhost:3000
```

It runs `webpack-dev-server` on port `:3000` and proxies all RPC calls to `http://localhost:8080`.

It means that you also need to run Ethereum client with JSON-RPC support.

#### Parity
To setup `parity` follow the intructions [here](https://github.com/ethcore/parity).
When you have `parity` installed, run:

```bash
$ parity -w                  # start parity with webapps support and JSON-RPC server on :8080
```

NOTE: running `$ parity -w --pruning fast` can save you some disk space.

### How to run tests?
#### Unit Tests
```bash
$ npm start                  # run development webserver
$ npm t                      # run unit tests in watchmode
```

#### Integration Tests
```bash
$ npm run startTest          # run with mocked backend (no client in background required)
$ npm run nightwatch         # run integration tests (by default requires Firefox browser)
```
