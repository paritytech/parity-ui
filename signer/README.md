# Parity Trusted Signer

Parity Trusted Signer DApp.

[Back to parity-ui](../)

## Development

```bash
 $ cd parity-ui/signer/web
 $ npm install
 $ npm start # Starts development server
 $ xdg-open http://localhost:3030 || open http://localhost:3030
```

You need to run Parity using:

```bash
$ cargo run --release --features signer-dev
```

to disable origin verification. Otherwise your development server will not be able to connect.


## Pre-compiling JS files

After you finish changing the source code you need to also commit pre-compiled JS files, otherwise the build will fail.

```bash
 $ cd parity-ui/signer/web
 $ rm -rf node_modules                  # Make sure to start with fresh dependencies
 $ rm -rf ../../components/node_modules
 $ npm install --ignore-scripts         # Install dependencies (but don't link components)
 $ NODE_ENV=production npm run build
```

You can also use:

```bash
 $ cd parity-ui
 $ ./web.sh clean && ./web.sh build
```

to re-compile everything (recommended).

---

Head to [parity-ui](../) to learn how to build Parity with your changes.
