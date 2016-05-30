#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

SOURCE_BRANCH="master"

# Don't deploy if
# 1. Pull request
# 2. Not source branch
# 3. Not pushing GH tags
if [[ ("$TRAVIS_PULL_REQUEST" != "false") || ("$TRAVIS_BRANCH" != "$SOURCE_BRANCH") || ( -z ${var+x} ) ]]; then
    echo 'Not deploying';
    exit 0
fi

PUBLISH_PATH="build"

# publish npm package
rm -rf "${PUBLISH_PATH}"
mkdir "${PUBLISH_PATH}"
cp -r src/* "${PUBLISH_PATH}"/
cp LICENSE "${PUBLISH_PATH}"/
cp README.md "${PUBLISH_PATH}"/
cp package.json "${PUBLISH_PATH}"/
cd "${PUBLISH_PATH}"/
npm publish

exit 0