#!/bin/bash
set -x
set -e

cd web
rm static -R || true
npm run build
# Back
cd -
cd ./src/web
rm -rf *
UI=../../web/static

cp ${UI}/inject.js .
cp ${UI}/home.js .
cp ${UI}/home.html index.html
cp ${UI}/home/cols.frame.html .
cp ${UI}/home/cols.frame.js .
