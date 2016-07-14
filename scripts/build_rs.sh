#!/bin/bash

set -e
set -x

function modified_rs() {
  HEAD=FETCH_HEAD
  # HEAD=HEAD

  RS_FILES_MODIFIED=`git --no-pager diff --name-only $HEAD $(git merge-base $HEAD master) | grep \.rs | wc -l`

  if [ -z $RS_FILES_MODIFIED ]; then
    return 1
  else
    return 0
  fi
}

PROJECTS=(home signer status wallet)

# For travis builds we check if there is a need to run this build
SHOULD_RUN=true
if [ "$TRAVIS_BRANCH" = "master" ]; then
  # Run build if:
  # 1. Any .rs file was modified
  # 2. Master branch is being built
  SHOULD_RUN=`modified_rs || [ $TRAVIS_PULL_REQUEST = false ]`
fi

if [ -z $SHOULD_RUN ]; then
  exit 0
fi

for PROJECT in ${PROJECTS[@]}; do
  cd $PROJECT
  cargo test --no-default-features --features with-syntex
  cd -
done
