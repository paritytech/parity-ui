#!/bin/sh
set -e
set -x

rm -rf ./src/web/* 
cd meteor-dapp-wallet/app
meteor-build-client ../../src/web --path "/wallet/"
cd -

sed -i '5i\<script src="/parity-utils/inject.js"></script>' ./src/web/index.html
sed -i '7i\<script>delete window.require;__meteor_runtime_config__.meteorEnv={NODE_ENV: "production"};</script>' ./src/web/index.html
echo "Bump version"
vim Cargo.toml
