# How to create parity webapplication.
1. Clone this repository.
   
   ```bash
   $ git clone https://github.com/tomusdrw/parity-webapp.git
   ```
1. Create a new directory for your webapp. (`./parity-myapp`)

   ```bash
   $ mkdir -p ./parity-myapp/src/web
   ```

1. Copy your frontend files to `./parity-myapp/src/web` (bundled ones)

   ```bash
   $ cp -r ./myapp-src/* ./parity-myapp/src/web
   ```

1. To create web3 in your app make sure to use: `new Web3(new Web3.providers.HttpProvider('/rpc/'))`
1. Create `./parity-myapp/Cargo.toml` with you apps details. See example here: [parity-status Cargo.toml](https://github.com/tomusdrw/parity-status/blob/master/Cargo.toml).

   ```bash
   $ wget https://raw.githubusercontent.com/tomusdrw/parity-status/master/Cargo.toml -O ./parity-myapp/Cargo.toml
   $ vim ./parity-myapp/Cargo.toml # Edit the details
   ```

1. Use included generator to create a rust source code of your web app.

   ```bash
   # Install dependencies
   $ cd ./parity-webapp/generate && npm install && cd -
   ```

   ```bash
   $ cd ./parity-myapp/src/web # You need to be in web folder
   $ ../../../parity-webapp/generate/index.js > ../lib.rs # we assume that you have `parity-webapp` repo
   ```

   You still need to keep your files in `./parity-myapp/src/web` (only binary files are inlined in `lib.rs`)

1. Commit the results and put it to some github repo.

   ```bash
   $ git init && git add . && git commit -am "My first parity webapp".
   ```

# How to include your webapp in `parity`?
1. Edit `webapp/Cargo.toml` and add dependency to your application (it can be optional)

   ```toml
   # Use git repo and version
   parity-myapp = { git = "https://github.com/johnwhitton/parity-myapp.git", version = "0.1.0" }
   # Or just specify path (speeds-up local development)
   parity-myapp = { path = "../../parity-myapp" }
   ```

1. Edit `webapp/src/apps.rs` and add your application to `all_pages` (if it's optional you need to specify two functions - see `parity-wallet` example)
1. Compile parity.
   
   ```bash
   $ cargo build --release # While inside `parity`
   ```
