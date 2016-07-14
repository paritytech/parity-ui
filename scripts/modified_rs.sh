#!/bin/sh

set -x
set -e

HEAD=FETCH_HEAD
# HEAD=HEAD

RS_FILES_MODIFIED=`git --no-pager diff --name-only $HEAD $(git merge-base $HEAD master) | grep \.rs | wc -l`

if [ $RS_FILES_MODIFIED = 0 ]; then
  exit 1
else
  exit 0
fi
