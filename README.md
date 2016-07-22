[![Build Status][travis-image]][travis-url] [![Join the chat at https://gitter.im/ethcore/parity][gitter-image]][gitter-url] [![GPLv3][license-image]][license-url]

# Parity UI

A set of [Parity](https://github.com/ethcore/parity) built-in Dapps and UI components.

## List of projects

* [Dapps React Components](./components) - Re-usable set of React Components
* [Home Page & TopBar](./home) - Parity Home Page & TopBar
* [Status Page](./status) - Status Page for your Parity node
* [Ethereum Wallet](./wallet) - Ethereum Wallet bundled for Parity
* [Trusted Signer](./signer) - Trusted Signer Dapp
* [Trusted Signer Chrome Extension](./extension) - Parity Integration Chrome Extension

### How to add a new Built-in Dapp?

See description in [Parity Dapps](./dapps).

## Development

Development procedures for each project are described in its' README files.

### Web.sh

You can use `./web.sh` script to automate some actions for all projects.

* `$ ./web.sh clean` - Remove `node_modules` for each project.
* `$ ./web.sh build` - Compile JS files for each project.
* `$ ./web.sh lint` - Run linting for each project.
* `$ ./web.sh test` - Run tests for each project.
* `$ ./web.sh shrinkwrap` - Regenerate `shrinkwrap.json` file for each project.


Before making a PR with your changes you should pre-compile all JS files (they are used when building Parity):

```bash
$ cd parity-ui
$ ./web.sh clean && ./web.sh build
```

Make sure to commit pre-compiled files.


### Building Parity

By default Parity is using pre-compiled files while building:
```bash
$ cd parity
$ cargo build --release # this will use pre-compiled JS files
```

You can do full Parity build using:
```bash
$ cd parity
$ cargo build --no-default-features --features ui
```

#### Building Parity with local version of Parity-UI

You can use [Cargo Config file](http://doc.crates.io/config.html) to use local version of your Parity UI (without modyfing original Cargo.toml files)

```toml
# ~/.cargo/config
# Location of parity-ui repo: ~/path/to/parity-ui
paths = [
  "path/to/parity-ui/dapps",
  "path/to/parity-ui/wallet",
  "path/to/parity-ui/home",
  "path/to/parity-ui/status",
  "path/to/parity-ui/signer"
]
```

This will always use your local version of Parity-UI while compiling Parity.


### Pre-push hook

You can install pre-push hook to run linting and tests for all projects.

```bash
$ cd parity-ui
$ ./scripts/hook.sh
```

[travis-image]: https://travis-ci.org/ethcore/parity-ui.svg?branch=master
[travis-url]: https://travis-ci.org/ethcore/parity-ui
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: http://www.gnu.org/licenses/gpl-3.0.en.html

