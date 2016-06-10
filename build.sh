#!/bin/sh
set -e
set -x

rm -rf ./src/web/* 
cd meteor-dapp-wallet/app
meteor-build-client ../../src/web --path "/wallet/"
cd -
cp icon.png ./src/web/
sed -i '5i\<style>.accounts-page .dapp-sticky-bar {top:-37px;}</style>' ./src/web/index.html
sed -i '6i\<script src="/parity-utils/inject.js" all-accounts></script>' ./src/web/index.html
sed -i '8i\<script>delete window.require;__meteor_runtime_config__.meteorEnv={NODE_ENV: "production"};</script>' ./src/web/index.html
echo "Bump version"
vim Cargo.toml
