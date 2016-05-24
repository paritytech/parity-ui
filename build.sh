#!/bin/sh
set -e
set -x

rm -rf ./src/web/* 
cd meteor-dapp-wallet/app
meteor-build-client ../../src/web --path "/wallet/"
cd -

./build_lib.sh

echo "Manualy modify ./src/web/index.html and include changes from old index.html"
git diff master -- src/web/index.html
echo "Bump version"
vim Cargo.toml
