# Parity DApps

Code generator to simplify creating a built-in Parity DApp

[Back to parity-ui](../README.md)

# How to create new builtin DApp.
1. Clone this repository.
   
   ```bash
   $ git clone https://github.com/ethcore/parity-ui.git
   ```

1. Create a new directory for your DApp. (`./myapp`)

   ```bash
   $ mkdir -p ./parity-ui/myapp/src/web
   ```

1. Copy your frontend files to `./myapp/src/web` (bundled ones)

   ```bash
   $ cp -r ./myapp-src/* ./parity-ui/myapp/src/web
   ```

1. Instead of creating `web3` in your app. Load (as the first script tag in `head`):

   ```html
   <script src="/parity-utils/inject.js"></script>
   ```
  
   The `inject.js` script will create global `web3` instance with proper provider that should be used by your dapp.

1. Create `./parity-ui/myapp/Cargo.toml` with you apps details. See example here: [parity-status Cargo.toml](https://github.com/ethcore/parity-ui/blob/master/status/Cargo.toml).

   ```bash
   $ cd ./parity-ui/
   $ cp ./home/Cargo.toml ./myapp/Cargo.toml
   $ cp ./home/build.rs ./myapp/build.rs
   $ cp ./home/src/lib.rs ./myapp/src/lib.rs
   $ cp ./home/src/lib.rs.in ./myapp/src/lib.rs.in
   # And edit the details of your app
   $ vim ./myapp/Cargo.toml # Edit the details
   $ vim ./myapp/src/lib.rs.in # Edit the details
   ```

1. Commit the results.

   ```bash
   $ git add myapp && git commit -am "My first Parity DApp".
   ```

# How to include your DApp in `Parity`?
1. Edit `dapps/Cargo.toml` and add dependency to your application (it can be optional)

   ```toml
   # Use git repo and version
   parity-dapps-myapp = { git = "https://github.com/ethcore/parity-ui.git", version = "0.1.0" }
   ```

1. Edit `dapps/src/apps.rs` and add your application to `all_pages` (if it's optional you need to specify two functions - see `parity-dapps-wallet` example)
1. Compile parity.
   
   ```bash
   $ cargo build --release # While inside `parity`
   ```
