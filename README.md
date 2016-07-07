[![Build Status](https://travis-ci.org/ethcore/parity-dapps-rs.svg?branch=master)](https://travis-ci.org/ethcore/parity-dapps-rs)
# How to create parity webapplication.
1. Clone this repository.
   
   ```bash
   $ git clone https://github.com/ethcore/parity-dapps-rs.git
   ```
1. Create a new directory for your webapp. (`./parity-myapp`)

   ```bash
   $ mkdir -p ./parity-myapp/src/web
   ```

1. Copy your frontend files to `./parity-myapp/src/web` (bundled ones)

   ```bash
   $ cp -r ./myapp-src/* ./parity-myapp/src/web
   ```

1. Instead of creating `web3` in your app. Load (as the first script tag in `head`):

   ```html
   <script src="/parity-utils/inject.js"></script>
   ```
  
   The `inject.js` script will create global `web3` instance with proper provider that should be used by your dapp.

1. Create `./parity-myapp/Cargo.toml` with you apps details. See example here: [parity-status Cargo.toml](https://github.com/ethcore/parity-status/blob/master/Cargo.toml).

   ```bash
   $ wget https://raw.githubusercontent.com/ethcore/parity-dapps-builtins-rs/master/Cargo.toml -O ./parity-myapp/Cargo.toml
   $ wget https://raw.githubusercontent.com/ethcore/parity-dapps-builtins-rs/master/build.rs -O ./parity-myapp/build.rs
   $ wget https://raw.githubusercontent.com/ethcore/parity-dapps-builtins-rs/master/src/lib.rs -O ./parity-myapp/src/lib.rs
   $ wget https://raw.githubusercontent.com/ethcore/parity-dapps-builtins-rs/master/src/lib.rs.in -O ./parity-myapp/src/lib.rs.in
   $ vim ./parity-myapp/Cargo.toml # Edit the details
   $ vim ./parity-myapp/src/lib.rs.in # Edit the details
   ```

1. Commit the results and put it to some github repo.

   ```bash
   $ git init && git add . && git commit -am "My first parity webapp".
   ```

# How to include your webapp in `parity`?
1. Edit `webapp/Cargo.toml` and add dependency to your application (it can be optional)

   ```toml
   # Use git repo and version
   parity-myapp = { git = "https://github.com/ethcore/parity-myapp.git", version = "0.1.0" }
   # Or just specify path (speeds-up local development)
   parity-myapp = { path = "../../parity-myapp" }
   ```

1. Edit `webapp/src/apps.rs` and add your application to `all_pages` (if it's optional you need to specify two functions - see `parity-wallet` example)
1. Compile parity.
   
   ```bash
   $ cargo build --release # While inside `parity`
   ```
