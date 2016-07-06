#!/bin/bash
set -x
set -e

cd ../parity-dapps-status/
rm -rf static || true
npm run build
# Back
cd -
cd ./src/web
rm -rf *
cp ../../../parity-dapps-status/static/* .
rm Cargo.toml
rm *.map

