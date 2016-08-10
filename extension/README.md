# Parity Trusted Signer Chrome Extension

[![Add to chrome][webstore-image]][webstore-url]

[Back to parity-ui](../README.md)

## Install

* [Get latest production version from webstore][webstore-url]

## Development

```bash
$ git clone git@github.com:ethcore/parity-ui.git
$ cd parity-ui/extension
$ npm i
$ npm start # build files to './dev', start webpack dev server
```

* [Load unpacked extensions][dev-ext-help-url] with `./dev` folder.

### Package Linking

When working on `signer` and `components` at the same time you need to link those packages:

```bash
$ npm run link
```

## Build

```bash
$ npm run genZip # build files to './build', pack to zip file
```

[webstore-image]: https://img.shields.io/chrome-web-store/v/fgodinogimdopkigkcoelpfkbnpngalc.svg
[webstore-url]: https://chrome.google.com/webstore/detail/parity-signer-ui/fgodinogimdopkigkcoelpfkbnpngalc
[dev-ext-help-url]: https://developer.chrome.com/extensions/getstarted#unpacked
