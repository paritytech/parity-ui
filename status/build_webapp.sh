#!/bin/bash
set -x
set -e

cd web
rm -rf static || true
npm run build
# Back
cd -
cd ./src/web
rm -rf *
cp ../../web/static/* .
rm *.map

