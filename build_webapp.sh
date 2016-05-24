#!/bin/bash
set -x
set -e

# This script assumes following directory structure:
# - parity-idmanager-rs
# - parity-web-ui ($ git clone https://github.com/ethcore/parity-web-ui.git)
# - parity-webapp ($ git clone https://github.com/ethcore/parity-webapp.git)

cd ../parity-web-ui
rm static -R || true
npm run build
# Back
cd -
cd ./src/web
rm -rf *
UI=../../../parity-web-ui/static

cp ${UI}/inject.js .
cp ${UI}/home.js .
cp ${UI}/home.html index.html
cp ${UI}/home/cols.frame.html .
cp ${UI}/home/cols.frame.js .
FULL_NAME="Identity Manager" ../../../parity-webapp/generate/index.js > ../lib.rs

