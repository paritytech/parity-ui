#!/bin/bash

set -e
set -x

# Run build
./web.sh build

# Check if there are any modified files
MODIFIED_FILES=`git status -s | wc -l`
if [ $MODIFIED_FILES != 0 ]; then
  echo "Some files seems to be modified during the build. You probably haven't committed compiled JS:"
  git status -s
  exit 1
fi

# Run tests
./web.sh test
