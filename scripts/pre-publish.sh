#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

BUILD_PATH="build"

rm -rf "$BUILD_PATH"
npm run build

cp "${BUILD_PATH}/index.js" index.js

exit 0