#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

# Don't deploy if
# 1. Pull request
# 2. Not source branch
# 3. Not pushing GH tags
if [[ ("$TRAVIS_PULL_REQUEST" != "false") || ( -z ${TRAVIS_TAG+x} ) ]]; then
    echo 'Not deploying because:';
    if [[ ("$TRAVIS_PULL_REQUEST" != "false") ]]; then echo 'its a pull request'; fi
    if [[ ( -z ${TRAVIS_TAG+x} ) ]]; then echo 'not tags'; fi
    exit 0
fi

PUBLISH_PATH="build"

# publish npm package
rm -rf "${PUBLISH_PATH}"
mkdir "${PUBLISH_PATH}"
cp -r src/* "${PUBLISH_PATH}/"
cp LICENSE "${PUBLISH_PATH}/"
cp README.md "${PUBLISH_PATH}/"
cp package.json "${PUBLISH_PATH}/"
cd "${PUBLISH_PATH}/"
npm publish

exit 0