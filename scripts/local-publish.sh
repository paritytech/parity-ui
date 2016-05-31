#!/bin/bash
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"${DIR}/pre-publish.sh"
npm publish
rm -f "${DIR}/../index.js"
rm -rf "${DIR}/../build"

exit 0