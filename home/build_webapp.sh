#!/bin/bash
set -x
set -e

# This script assumes following directory structure:
# - parity-idmanager-rs
# - parity-dapps-home ($ git clone https://github.com/ethcore/parity-dapps-home.git)

cd ../parity-dapps-home
rm static -R || true
npm run build
# Back
cd -
cd ./src/web
rm -rf *
UI=../../../parity-dapps-home/static

cp ${UI}/inject.js .
cp ${UI}/home.js .
cp ${UI}/home.html index.html
cp ${UI}/home/cols.frame.html .
cp ${UI}/home/cols.frame.js .
