#!/bin/bash

set -e
set -x

PROJECTS=(home signer status wallet)

# For travis builds we check if there is a need to run this build
SHOULD_RUN=true
if [ "$TRAVIS_BRANCH" = "master" ]; then
  # Run build if:
  # 1. Any .rs file was modified
  # 2. Master branch is being built
  RS_MODIFIED=`./scripts/modified_rs.sh`
  SHOULD_RUN=$RS_MODIFIED || [ $TRAVIS_PULL_REQUEST = false ]
fi

if [ $SHOULD_RUN != true ]; then
  exit 0
fi

for PROJECT in ${PROJECTS[@]}; do
  cd $PROJECT
  cargo test --no-default-features --features with-syntex
  cd -
done
