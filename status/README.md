# Parity Status Page

Parity Status Page.

[Back to parity-ui](../README.md)

## Development

```bash
 $ cd parity-ui/status/web
 $ npm install
 $ npm start # Starts development server
 $ xdg-open http://localhost:3040 || open http://localhost:3040
```

Make sure to have Parity running.

### Package Linking

When working on `components` at the same time you need to link that package:

```bash
$ npm run link
```

## Pre-compiling JS files

After you finish changing the source code you need to also commit pre-compiled JS files, otherwise the build will fail.

```bash
 $ cd parity-ui/status/web
 $ rm -rf node_modules                  # Make sure to start with fresh dependencies
 $ rm -rf ../../components/node_modules
 $ npm install --ignore-scripts         # Install dependencies (but don't link components)
 $ NODE_ENV=production npm run build
```

You can also use:

```bash
 $ cd parity-ui
 $ ./web.sh build
```

to re-compile everything (recommended).

---

Head to [parity-ui](../README.md) to learn how to build Parity with your changes.

