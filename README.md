# How to create parity webapplication.
1. Create a new directory for your webapp. (`./webapp`)
1. Copy your frontend files to `./webapp/src/web` (bundled ones)
1. To instantiate your web3 use: `new Web3(new Web3.providers.HttpProvider('/rpc/'))`
1. Create `./webapp/Cargo.toml` with you apps details. See example here: [https://github.com/tomusdrw/parity-status/blob/master/Cargo.toml](parity-status Cargo.toml).
1. Use included generator to create a rust source code of your web app.
   ```
   $ cd webapp/src/web
   $ ../../../parity-webapp/generate/index.js > ../lib.rs
   ```
   You still need to keep your files in `./src/web` (only binary files are inlined in `lib.rs`)
1. Commit the results and put it to some github repo.

# How to include your webapp in `parity`?
1. Edit `webapp/Cargo.toml` and add dependency to your application (it can be optional)
1. Edit `webapp/src/apps.rs` and add your application to `all_pages` (if it's optional you need to specify two functions - see `parity-wallet` example)
1. Compile parity.
